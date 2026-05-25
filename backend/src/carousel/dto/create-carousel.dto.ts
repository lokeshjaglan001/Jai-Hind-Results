import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCarouselDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsUrl()
  @IsOptional()
  link?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}