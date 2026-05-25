// submit-form.dto.ts
import { IsString, IsObject, IsOptional, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SubmitFormDto {
  @IsString()
  formId: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return value;
  })
  @IsObject()
  data: Record<string, any>;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value, 10);
    }
    return value;
  })
  @IsNumber()
  userId: number;

  @IsOptional()
  files?: { [key: string]: any }; // for file uploads
}