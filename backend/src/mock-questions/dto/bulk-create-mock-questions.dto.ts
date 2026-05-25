import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class BulkCreateMockQuestionDto {
  @Type(() => Number)
  @IsInt()
  test_id: number;
}