import { IsString, IsOptional, IsNumber, IsBoolean, IsUrl } from 'class-validator';

export class UpdateFileDto {
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
  @IsUrl()
  file_url?: string;

  @IsOptional()
  @IsUrl()
  thumbnail_url?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsBoolean()
  is_published?: boolean;
}