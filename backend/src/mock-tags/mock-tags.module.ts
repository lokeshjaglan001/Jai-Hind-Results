import { Module } from '@nestjs/common';
import { MockTagsService } from './mock-tags.service';
import { MockTagsController } from './mock-tags.controller';

@Module({
  controllers: [MockTagsController],
  providers: [MockTagsService],
})
export class MockTagsModule {}