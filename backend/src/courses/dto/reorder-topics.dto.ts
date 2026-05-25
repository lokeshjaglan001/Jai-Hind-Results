import { IsArray, IsInt, ArrayNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class ReorderTopicsDto {
  // Although courseId comes from URL, include for completeness if needed elsewhere
  // @Transform(({ value }) => parseInt(value))
  // @IsInt()
  // courseId: number;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(Number); // Handle comma-separated string if needed
    }
    return value; // Assume it's an array
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  orderedTopicIds: number[]; // Array of topic IDs in the desired order
}