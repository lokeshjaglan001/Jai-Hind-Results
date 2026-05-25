import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  // Add thumbnail_url explicitly if needed for updates via multipart/form-data
  @IsString()
  @IsOptional()
  thumbnail_url?: string;
}