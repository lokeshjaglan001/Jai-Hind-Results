import { Module } from '@nestjs/common';
import { MockQuestionsService } from './mock-questions.service';
import { MockQuestionsController } from './mock-questions.controller';

@Module({
  controllers: [MockQuestionsController],
  providers: [MockQuestionsService],
})
export class MockQuestionsModule {}