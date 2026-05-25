import { PartialType } from '@nestjs/mapped-types';
import { CreatePostTemplateDto } from './create-post-template.dto';

export class UpdatePostTemplateDto extends PartialType(CreatePostTemplateDto) {}