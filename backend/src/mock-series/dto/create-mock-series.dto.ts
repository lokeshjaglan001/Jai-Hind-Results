import { Type, Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsNumber, IsArray, ArrayMinSize } from 'class-validator';

export class CreateMockSeriesDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
  
  @IsString()
  @IsOptional()
  thumbnail_url?: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @Transform(({ value }) => parseInt(value)) // Add this
  @IsInt()
  category_id: number;

  @Transform(({ value }) => value.split(',').map(Number)) // Add this
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  @IsOptional()
  tagIds?: number[];
}