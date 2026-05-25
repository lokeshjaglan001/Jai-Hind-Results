import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTopicDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}