import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { SubmitFormDto } from './dto/submit-form.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';

@Injectable()
export class FormsService {
  private razorpay: Razorpay;

  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  // Create a form
  async createForm(dto: CreateFormDto) {
    // Generate slug if not provided
    const slug = dto.slug || dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check if slug already exists
    const existing = await this.prisma.form.findUnique({ where: { slug } });
    if (existing) {
      throw new BadRequestException('A form with this slug already exists');
    }

    const form = await this.prisma.form.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        published: dto.published ?? false,
        price: dto.price,
        fields: {
          create: dto.fields.map(f => ({
            key: f.key,
            label: f.label,
            type: f.type,
            required: f.required ?? false,
            options: f.options,
            order: f.order,
            meta: f.meta,
          })),
        },
      },
      include: { fields: { orderBy: { order: 'asc' } } },
    });
    return form;
  }

  // Get form by ID (admin)
  async getFormById(id: string) {
    const form = await this.prisma.form.findUnique({
      where: { id },
      include: { 
        fields: { orderBy: { order: 'asc' } },
        _count: {
          select: { submissions: true }
        }
      },
    });
    if (!form) throw new NotFoundException('Form not found');
    return form;
  }

  // Get form by slug
  async getFormBySlug(slug: string) {
    const form = await this.prisma.form.findUnique({
      where: { slug },
      include: { fields: { orderBy: { order: 'asc' } } },
    });
    if (!form) throw new NotFoundException('Form not found');
    if (!form.published) throw new BadRequestException('Form is not published');
    return form;
  }

  // Get all published forms
  async getForms() {
    return this.prisma.form.findMany({
      where: { published: true },
      include: { 
        fields: { orderBy: { order: 'asc' } },
        _count: {
          select: { submissions: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  // Get all forms (admin)
  async getAllForms() {
    return this.prisma.form.findMany({
      include: { 
        fields: { orderBy: { order: 'asc' } },
        _count: {
          select: { submissions: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  // Update form
  async updateForm(id: string, dto: UpdateFormDto) {
    const form = await this.prisma.form.findUnique({ where: { id } });
    if (!form) throw new NotFoundException('Form not found');

    // If slug is being updated, check uniqueness
    if (dto.slug && dto.slug !== form.slug) {
      const existing = await this.prisma.form.findUnique({ where: { slug: dto.slug } });
      if (existing) {
        throw new BadRequestException('A form with this slug already exists');
      }
    }

    // Update form and fields
    const updated = await this.prisma.form.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.slug && { slug: dto.slug }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.published !== undefined && { published: dto.published }),
        ...(dto.price !== undefined && { price: dto.price }),
      },
      include: { fields: { orderBy: { order: 'asc' } } },
    });

    // Update fields if provided
    if (dto.fields) {
      // Delete existing fields
      await this.prisma.field.deleteMany({ where: { form_id: id } });
      
      // Create new fields
      await this.prisma.field.createMany({
        data: dto.fields.map(f => ({
          form_id: id,
          key: f.key,
          label: f.label,
          type: f.type,
          required: f.required ?? false,
          options: f.options,
          order: f.order,
          meta: f.meta,
        })),
      });
    }

    return this.getFormById(id);
  }

  // Delete form
  async deleteForm(id: string) {
    const form = await this.prisma.form.findUnique({
      where: { id },
      include: { _count: { select: { submissions: true } } }
    });
    
    if (!form) throw new NotFoundException('Form not found');
    
    // Check if form has submissions
    if (form._count.submissions > 0) {
      throw new BadRequestException('Cannot delete form with existing submissions');
    }

    // Delete fields first
    await this.prisma.field.deleteMany({ where: { form_id: id } });
    
    // Delete form
    await this.prisma.form.delete({ where: { id } });
    
    return { success: true, message: 'Form deleted successfully' };
  }

  // Check if user has already submitted
  async checkUserSubmission(formId: string, userId: number) {
    const submission = await this.prisma.submission.findFirst({
      where: {
        form_id: formId,
        user_id: userId,
      },
    });

    return {
      hasSubmitted: !!submission,
      submission: submission || null,
    };
  }

  // Submit a form
  async submitForm(dto: SubmitFormDto, files: Express.Multer.File[]) {
    const form = await this.prisma.form.findUnique({ 
      where: { id: dto.formId },
      include: { fields: true }
    });
    
    if (!form) throw new NotFoundException('Form not found');
    if (!form.published) throw new BadRequestException('Form is not published');

    // Check if user already submitted
    const existingSubmission = await this.prisma.submission.findFirst({
      where: {
        form_id: form.id,
        user_id: dto.userId,
    },
    });

    if (existingSubmission) {
      throw new BadRequestException('You have already submitted this form');
    }

    // Parse data if it's a string (from FormData)
    let parsedData = dto.data;
    if (typeof dto.data === 'string') {
      try {
        parsedData = JSON.parse(dto.data);
      } catch (e) {
        throw new BadRequestException('Invalid JSON data');
      }
    }

    // Process file uploads
    const formData = { ...parsedData };
    
    if (files && files.length > 0) {
      for (const file of files) {
        const fieldName = file.fieldname;
        try {
          const publicUrl = await this.supabase.uploadFile(
            file,
            'forms', // bucket name
            `${form.id}` // path within bucket
          );
          formData[fieldName] = publicUrl;
        } catch (error) {
          throw new BadRequestException(`File upload failed: ${error.message}`);
        }
      }
    }

    // Create submission
    const submission = await this.prisma.submission.create({
      data: {
        form_id: form.id,
        user_id: dto.userId,
        data: formData,
        paid: !form.price || form.price.toNumber() === 0,
      },
    });

    // If paid form, create Razorpay order
    if (form.price && form.price.toNumber() > 0) {
      const order = await this.razorpay.orders.create({
        amount: Math.round(form.price.toNumber() * 100), // Convert to paise
        currency: 'INR',
        receipt: submission.id,
      });

      await this.prisma.form_payments.create({
        data: {
          form_id: form.id,
          submission_id: submission.id,
          provider: 'razorpay',
          provider_payment_id: order.id,
          amount: form.price,
          status: 'pending',
        },
      });

      return { submission, order };
    }

    return { submission };
  }

  // Get form submissions (admin)
  async getFormSubmissions(formId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      this.prisma.submission.findMany({
        where: { form_id: formId },
        include: {
          user: {
            select: {
              id: true,
              full_name: true,
              email: true,
            }
          },
          payment: true,
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.submission.count({
        where: { form_id: formId },
      }),
    ]);

    return {
      submissions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get submission by ID (admin)
  async getSubmissionById(submissionId: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        form: {
          include: {
            fields: { orderBy: { order: 'asc' } }
          }
        },
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
          }
        },
        payment: true,
      },
    });

    if (!submission) throw new NotFoundException('Submission not found');
    return submission;
  }

  // Verify payment
  async verifyPayment(dto: VerifyPaymentDto) {
    const payment = await this.prisma.form_payments.findUnique({
      where: { submission_id: dto.submissionId },
    });
    if (!payment) throw new BadRequestException('Payment not found');

    // Validate Razorpay signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET ?? "");
    hmac.update(dto.razorpay_order_id + '|' + dto.razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== dto.razorpay_signature) {
      throw new BadRequestException('Invalid payment signature');
    }

    // Update payment and submission
    await this.prisma.form_payments.update({
      where: { id: payment.id },
      data: {
        provider_payment_id: dto.razorpay_payment_id,
        status: 'success',
      },
    });

    await this.prisma.submission.update({
      where: { id: dto.submissionId },
      data: { paid: true },
    });

    return { success: true };
  }
}