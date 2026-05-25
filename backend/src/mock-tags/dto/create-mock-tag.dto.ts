import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMockTagDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}