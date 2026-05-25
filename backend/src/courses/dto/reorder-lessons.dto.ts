import { IsArray, IsInt, ArrayNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class ReorderLessonsDto {
  // Although topicId comes from URL, include for completeness if needed elsewhere
  // @Transform(({ value }) => parseInt(value))
  // @IsInt()
  // topicId: number;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(Number); // Handle comma-separated string if needed
    }
    return value; // Assume it's an array
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  orderedLessonIds: number[]; // Array of lesson IDs in the desired order
}