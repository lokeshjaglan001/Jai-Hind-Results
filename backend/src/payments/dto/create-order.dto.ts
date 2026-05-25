// src/payments/dto/create-order.dto.ts
import { IsInt, IsOptional, ValidateIf } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @IsOptional()
  @ValidateIf(o => o.course_id === undefined) // Require if course_id is not provided
  mock_series_id?: number;

  @IsInt()
  @IsOptional()
  @ValidateIf(o => o.mock_series_id === undefined) // Require if mock_series_id is not provided
  course_id?: number;
}