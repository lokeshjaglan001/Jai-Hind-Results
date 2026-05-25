import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonDto } from './create-lesson.dto';
import { IsOptional, IsString, Matches, IsUrl } from 'class-validator';

export class UpdateLessonDto extends PartialType(CreateLessonDto) {
  // Add featured_image_url explicitly if needed for updates via multipart/form-data
  @IsString()
  @IsOptional()
  featured_image_url?: string;

  @IsUrl()
  @Matches(
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
    { message: 'Please provide a valid YouTube watch URL (e.g., https://www.youtube.com/watch?v=...)' }
  )
  @IsOptional()
  video_url?: string;
}