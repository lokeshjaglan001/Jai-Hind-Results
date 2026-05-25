// create-form.dto.ts
import { IsString, IsOptional, IsBoolean, IsNumber, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class CreateFieldDto {
  @IsString()
  key: string;

  @IsString()
  label: string;

  @IsString()
  type: string;

  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @IsOptional()
  options?: any;

  @IsNumber()
  order: number;

  @IsOptional()
  meta?: any;
}

export class CreateFormDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsOptional()
  @IsNumber()
  price?: number; // in INR

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFieldDto)
  fields: CreateFieldDto[];
}