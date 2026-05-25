import { PartialType } from '@nestjs/mapped-types';
import { CreateMockQuestionDto } from './create-mock-question.dto';

export class UpdateMockQuestionDto extends PartialType(CreateMockQuestionDto) {}