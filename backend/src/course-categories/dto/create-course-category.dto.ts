import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourseCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}