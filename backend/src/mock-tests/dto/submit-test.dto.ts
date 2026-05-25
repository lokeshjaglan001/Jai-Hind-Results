import { IsObject, IsNotEmpty } from 'class-validator';

export class SubmitTestDto {
  @IsObject()
  @IsNotEmpty()
  answers: Record<string, string>;
}