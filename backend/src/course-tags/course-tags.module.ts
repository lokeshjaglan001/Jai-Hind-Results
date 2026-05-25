import { Module } from '@nestjs/common';
import { CourseTagsService } from './course-tags.service';
import { CourseTagsController } from './course-tags.controller';

@Module({
  controllers: [CourseTagsController],
  providers: [CourseTagsService],
})
export class CourseTagsModule {}