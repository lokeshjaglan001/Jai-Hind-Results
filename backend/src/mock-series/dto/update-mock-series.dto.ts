import { PartialType } from '@nestjs/mapped-types';
import { CreateMockSeriesDto } from './create-mock-series.dto';

export class UpdateMockSeriesDto extends PartialType(CreateMockSeriesDto) {}