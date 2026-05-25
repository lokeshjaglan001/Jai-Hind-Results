// verify-payment.dto.ts
import { IsString } from 'class-validator';

export class VerifyPaymentDto {
  @IsString()
  submissionId: string;

  @IsString()
  razorpay_payment_id: string;

  @IsString()
  razorpay_order_id: string;

  @IsString()
  razorpay_signature: string;
}