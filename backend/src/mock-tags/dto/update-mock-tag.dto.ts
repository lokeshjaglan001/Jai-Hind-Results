import { PartialType } from '@nestjs/mapped-types';
import { CreateMockTagDto } from './create-mock-tag.dto';

export class UpdateMockTagDto extends PartialType(CreateMockTagDto) {}