import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class PaymentsService {
  private razorpay: Razorpay;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  async createOrder(createOrderDto: CreateOrderDto, userId: number) {
    const { mock_series_id, course_id } = createOrderDto;

    let item: any; // To hold either mock_series or course
    let amount: number;
    let title: string;
    let type: 'mock_series' | 'course';

    if (mock_series_id) {
      item = await this.prisma.mock_series.findUnique({
        where: { id: mock_series_id },
      });
      if (!item || !item.price || Number(item.price) <= 0) {
        throw new NotFoundException('Paid mock series not found or has no price.');
      }
      amount = Number(item.price);
      title = item.title;
      type = 'mock_series';
    } else if (course_id) {
      item = await this.prisma.courses.findUnique({
        where: { id: course_id },
      });
      // Use regular_price for courses, adjust if using sale_price logic
      if (!item || item.pricing_model !== 'paid' || !item.regular_price || Number(item.regular_price) <= 0) {
        throw new NotFoundException('Paid course not found or has no price.');
      }
      const regularPriceNum = Number(item.regular_price);
      const salePriceNum = item.sale_price ? Number(item.sale_price) : null;

      // Use sale price if it exists, is greater than 0, and less than regular price
      if (salePriceNum !== null && salePriceNum > 0 && salePriceNum < regularPriceNum) {
        amount = salePriceNum;
      } else {
        amount = regularPriceNum;
      } // Or implement sale_price logic
      title = item.title;
      type = 'course';
    } else {
      throw new BadRequestException('Either mock_series_id or course_id must be provided.');
    }

    if (amount <= 0) {
        throw new BadRequestException('Calculated item price is invalid.');
    }

    const amountInPaise = amount * 100;
    const itemId = mock_series_id ?? course_id; // Get the actual ID provided

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${type}_${itemId}_user_${userId}`, // Dynamic receipt
    };

    const order = await this.razorpay.orders.create(options);

    // Save payment record with correct ID
    await this.prisma.payments.create({
      data: {
        amount: amount,
        payment_method: 'razorpay',
        status: 'pending',
        transaction_id: order.id,
        user_id: userId,
        mock_series_id: mock_series_id, // Will be null if courseId is provided
        course_id: course_id,       // Will be null if mockSeriesId is provided
      },
    });

    return {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      item_title: title, // Renamed for clarity
      item_type: type,
    };
  }

  async verifyPayment(body: any, signature: string) {
    const webhookSecret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
        console.error('FATAL ERROR: RAZORPAY_WEBHOOK_SECRET is not set in .env file.');
        throw new InternalServerErrorException('Webhook secret is not configured.');
    }

    const shasum = crypto.createHmac('sha256', webhookSecret);
    // IMPORTANT: Razorpay generates the signature from the raw request body.
    shasum.update(JSON.stringify(body));
    const digest = shasum.digest('hex');

    if (digest !== signature) {
      console.error('SIGNATURE MISMATCH: Generated digest does not match the Razorpay signature.');
      throw new BadRequestException('Invalid webhook signature.');
    }

    const { order_id } = body.payload.payment.entity;

    const updatedPayment = await this.prisma.payments.update({
      where: { transaction_id: order_id },
      data: {
        status: 'success',
      },
    });

    return { status: 'ok', payment: updatedPayment };
  } 

  async findByUser(userId: number) {
    return this.prisma.payments.findMany({
      where: { user_id: userId },
      include: {
        mock_series: {
          include: {
            mock_categories: true,
            mock_series_tests: {
              include: { test: true },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}