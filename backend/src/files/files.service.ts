import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { PurchaseFileDto } from './dto/purchase-file.dto';
import { VerifyFilePaymentDto } from './dto/verify-file-payment.dto';

@Injectable()
export class FilesService {
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

  // Create a file (admin only)
  async createFile(dto: CreateFileDto) {
    // Check if slug already exists
    const existing = await this.prisma.downloadable_file.findUnique({ 
      where: { slug: dto.slug } 
    });
    
    if (existing) {
      throw new BadRequestException('A file with this slug already exists');
    }

    return this.prisma.downloadable_file.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        file_url: dto.file_url,
        thumbnail_url: dto.thumbnail_url,
        price: dto.price,
        is_published: dto.is_published ?? false,
      },
    });
  }

  // Get all published files (public)
  async getPublishedFiles() {
    return this.prisma.downloadable_file.findMany({
      where: { is_published: true },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnail_url: true,
        price: true,
        downloads_count: true,
        created_at: true,
      },
    });
  }

  // Get all files (admin only)
  async getAllFiles() {
    return this.prisma.downloadable_file.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        _count: {
          select: { 
            purchases: true,
            payments: true 
          }
        }
      }
    });
  }

  // Get file by slug (public)
  async getFileBySlug(slug: string) {
    const file = await this.prisma.downloadable_file.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnail_url: true,
        price: true,
        is_published: true,
        downloads_count: true,
        created_at: true,
      }
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (!file.is_published) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  // Get file by ID (admin only)
  async getFileById(id: string) {
    const file = await this.prisma.downloadable_file.findUnique({
      where: { id },
      include: {
        _count: {
          select: { 
            purchases: true,
            payments: true 
          }
        }
      }
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  // Update file (admin only)
  async updateFile(id: string, dto: UpdateFileDto) {
    const file = await this.prisma.downloadable_file.findUnique({ where: { id } });
    
    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Check slug uniqueness if being updated
    if (dto.slug && dto.slug !== file.slug) {
      const existing = await this.prisma.downloadable_file.findUnique({ 
        where: { slug: dto.slug } 
      });
      
      if (existing) {
        throw new BadRequestException('A file with this slug already exists');
      }
    }

    return this.prisma.downloadable_file.update({
      where: { id },
      data: dto,
    });
  }

  // Delete file (admin only)
  async deleteFile(id: string) {
    const file = await this.prisma.downloadable_file.findUnique({ where: { id } });
    
    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Note: Supabase file deletion can be added later if needed
    // For now, we just delete the database record
    
    return this.prisma.downloadable_file.delete({ where: { id } });
  }

  // Check if user has already purchased file
  async checkUserPurchase(fileId: string, userId: number) {
    const purchase = await this.prisma.purchased_file.findUnique({
      where: {
        file_id_user_id: {
          file_id: fileId,
          user_id: userId,
        },
      },
    });

    return {
      hasPurchased: !!purchase,
      purchase,
    };
  }

  // Purchase file (create Razorpay order)
  async purchaseFile(dto: PurchaseFileDto) {
    const file = await this.prisma.downloadable_file.findUnique({
      where: { id: dto.fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (!file.is_published) {
      throw new BadRequestException('File is not available for purchase');
    }

    // Check if already purchased
    const existingPurchase = await this.prisma.purchased_file.findUnique({
      where: {
        file_id_user_id: {
          file_id: file.id,
          user_id: dto.userId,
        },
      },
    });

    if (existingPurchase) {
      throw new BadRequestException('You have already purchased this file');
    }

    // If file is free
    if (file.price.toNumber() === 0) {
      const purchase = await this.prisma.purchased_file.create({
        data: {
          file_id: file.id,
          user_id: dto.userId,
        },
      });

      // Increment download count
      await this.prisma.downloadable_file.update({
        where: { id: file.id },
        data: { downloads_count: { increment: 1 } },
      });

      return { purchase, file };
    }

    // Create Razorpay order for paid file
    // Receipt must be max 40 chars - using shortened file ID and timestamp
    const shortReceipt = `f_${file.id.slice(0, 10)}_${Date.now().toString().slice(-10)}`;
    
    const order = await this.razorpay.orders.create({
      amount: Math.round(file.price.toNumber() * 100), // Convert to paise
      currency: 'INR',
      receipt: shortReceipt,
    });

    // Create payment record
    const payment = await this.prisma.file_payment.create({
      data: {
        file_id: file.id,
        user_id: dto.userId,
        razorpay_order_id: order.id,
        amount: file.price,
        status: 'pending',
      },
    });

    return { order, payment, file };
  }

  // Verify Razorpay payment
  async verifyPayment(dto: VerifyFilePaymentDto) {
    const payment = await this.prisma.file_payment.findUnique({
      where: { id: dto.paymentId },
      include: { file: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${dto.razorpay_order_id}|${dto.razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== dto.razorpay_signature) {
      // Update payment status to failed
      await this.prisma.file_payment.update({
        where: { id: payment.id },
        data: { status: 'failed' },
      });
      
      throw new BadRequestException('Payment verification failed');
    }

    // Update payment record
    const updatedPayment = await this.prisma.file_payment.update({
      where: { id: payment.id },
      data: {
        razorpay_payment_id: dto.razorpay_payment_id,
        razorpay_signature: dto.razorpay_signature,
        status: 'success',
      },
    });

    // Create purchase record
    const purchase = await this.prisma.purchased_file.create({
      data: {
        file_id: payment.file_id,
        user_id: payment.user_id,
      },
    });

    // Increment download count
    await this.prisma.downloadable_file.update({
      where: { id: payment.file_id },
      data: { downloads_count: { increment: 1 } },
    });

    return { 
      success: true, 
      payment: updatedPayment, 
      purchase,
      file: payment.file 
    };
  }

  // Get user's purchased files
  async getUserPurchasedFiles(userId: number) {
    return this.prisma.purchased_file.findMany({
      where: { user_id: userId },
      include: {
        file: {
          select: {
            id: true,
            title: true,
            description: true,
            file_url: true,
            thumbnail_url: true,
            price: true,
          },
        },
      },
      orderBy: { purchased_at: 'desc' },
    });
  }

  // Upload file to Supabase (admin)
  async uploadFileToStorage(file: Express.Multer.File, folder: string = 'files') {
    try {
      const publicUrl = await this.supabase.uploadFile(
        file,
        'downloadable', // bucket name
        folder // path within bucket
      );
      return { publicUrl };
    } catch (error) {
      throw new BadRequestException(`File upload failed: ${error.message}`);
    }
  }

  // Get file purchases (admin)
  async getFilePurchases(fileId: string) {
    return this.prisma.purchased_file.findMany({
      where: { file_id: fileId },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
      orderBy: { purchased_at: 'desc' },
    });
  }

  // Get all payments (admin)
  async getAllPayments() {
    return this.prisma.file_payment.findMany({
      include: {
        file: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }
}