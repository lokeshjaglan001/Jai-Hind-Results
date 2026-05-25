// update-form.dto.ts
import { IsString, IsOptional, IsBoolean, IsNumber, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateFieldDto {
  @IsOptional()
  @IsString()
  id?: string;

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

export class UpdateFormDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFieldDto)
  fields?: UpdateFieldDto[];
}