import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseTagDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}