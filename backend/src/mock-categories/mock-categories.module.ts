import { Module } from '@nestjs/common';
import { MockCategoriesService } from './mock-categories.service';
import { MockCategoriesController } from './mock-categories.controller';

@Module({
  controllers: [MockCategoriesController],
  providers: [MockCategoriesService],
})
export class MockCategoriesModule {}