import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMockCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}