import { IsString, IsOptional, IsNumber, IsBoolean, IsUrl } from 'class-validator';

export class CreateFileDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUrl()
  file_url: string;

  @IsOptional()
  @IsUrl()
  thumbnail_url?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  is_published?: boolean;
}