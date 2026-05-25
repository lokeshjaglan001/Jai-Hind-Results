import { Module } from '@nestjs/common';
import { MockSeriesService } from './mock-series.service';
import { MockSeriesController } from './mock-series.controller';

@Module({
  controllers: [MockSeriesController],
  providers: [MockSeriesService],
})
export class MockSeriesModule {}