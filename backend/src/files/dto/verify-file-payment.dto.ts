import { IsString } from 'class-validator';

export class VerifyFilePaymentDto {
  @IsString()
  paymentId: string; // file_payment record ID

  @IsString()
  razorpay_payment_id: string;

  @IsString()
  razorpay_order_id: string;

  @IsString()
  razorpay_signature: string;
}