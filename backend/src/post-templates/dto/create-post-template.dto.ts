import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreatePostTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  // CHANGE THIS from @IsObject() to @IsString()
  @IsString()
  @IsNotEmpty()
  structure: string; // Type is now string
}