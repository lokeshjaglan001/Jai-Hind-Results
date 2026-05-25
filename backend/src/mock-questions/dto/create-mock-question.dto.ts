import { IsString, IsNotEmpty, IsOptional, IsInt, IsObject, IsEnum } from 'class-validator';
import { question_type } from '../../../generated/prisma';

export class CreateMockQuestionDto {
  @IsInt()
  test_id: number;

  @IsString()
  @IsNotEmpty()
  question_text: string;

  @IsEnum(question_type)
  @IsOptional()
  question_type?: question_type;

  @IsObject()
  @IsOptional()
  options?: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  correct_answer: string;

  @IsInt()
  @IsOptional()
  marks?: number;
}