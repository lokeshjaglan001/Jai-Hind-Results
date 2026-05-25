import { PartialType } from '@nestjs/mapped-types';
import { CreateMockCategoryDto } from './create-mock-category.dto';

export class UpdateMockCategoryDto extends PartialType(CreateMockCategoryDto) {}