import { Module } from '@nestjs/common';
import { PostTemplatesService } from './post-templates.service';
import { PostTemplatesController } from './post-templates.controller';

@Module({
  controllers: [PostTemplatesController],
  providers: [PostTemplatesService],
})
export class PostTemplatesModule {}