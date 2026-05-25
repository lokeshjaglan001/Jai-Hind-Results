import { IsString, IsNumber } from 'class-validator';

export class PurchaseFileDto {
  @IsString()
  fileId: string;

  @IsNumber()
  userId: number;
}