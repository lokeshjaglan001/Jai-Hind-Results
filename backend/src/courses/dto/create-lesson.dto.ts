import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsUrl,
  Min,
  Matches
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  @Matches(
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
    { message: 'Please provide a valid YouTube watch URL (e.g., https://www.youtube.com/watch?v=...)' }
  )
  video_url: string; 

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(0)
  @IsOptional() // Manual input for now
  video_duration_sec?: number; // Duration in seconds

  // featured_image_url will be handled by controller/service if file is uploaded
  featured_image_url?: string;

  // topic_id will typically come from the route parameter
}