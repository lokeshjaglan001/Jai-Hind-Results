import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsUrl,
  Min,
  ValidateIf,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CoursePricingModel, CourseStatus } from '../../../generated/prisma'; // Assuming generated prisma client location

// Helper function to convert HH:MM to seconds
const timeToSeconds = (time: string): number | null => {
  if (!time || !/^\d{1,2}:\d{2}$/.test(time)) {
    return null; // Return null for invalid format
  }
  const parts = time.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes) || minutes > 59) {
    return null; // Return null for invalid values
  }
  return hours * 3600 + minutes * 60;
};

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  intro_video_url?: string; // YouTube URL

  @IsEnum(CoursePricingModel)
  pricing_model: CoursePricingModel;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  @ValidateIf((o) => o.pricing_model === CoursePricingModel.paid) // Required only if paid
  @IsOptional() // Make optional overall, but ValidateIf makes it required conditionally
  regular_price?: number;

  @Transform(({ value }) => (value ? parseFloat(value) : null))
  @IsNumber()
  @Min(0)
  @IsOptional()
  sale_price?: number; // Should add custom validation: sale_price < regular_price in service

  @IsUrl()
  @IsOptional()
  external_link?: string; // External link for paid courses

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  category_id: number; // ID for course_categories

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      // Handle empty string case
      if (value.trim() === '') {
        return [];
      }
      return value.split(',').map(Number).filter(n => !isNaN(n) && n > 0);
    }
    return value; // Assume it's already an array if not string (e.g., from raw JSON update)
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tagIds?: number[]; // IDs for course_tags

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      // Handle empty string case
      if (value.trim() === '') {
        return [];
      }
      return value.split(',').map(Number).filter(n => !isNaN(n) && n > 0);
    }
    return value;
  })
  @IsArray()
  @IsInt({ each: true })
  @ArrayNotEmpty()
  authorIds: number[]; // IDs for users (admins)

  @IsString()
  @Matches(/^\d{1,2}:\d{2}$/, {
    message: 'Total duration must be in HH:MM format',
  })
  @IsOptional() // Make optional as it might be calculated later
  total_duration_hhmm?: string; // Author input format

  @IsEnum(CourseStatus)
  @IsOptional()
  status?: CourseStatus;
  thumbnail_url?: string;
}