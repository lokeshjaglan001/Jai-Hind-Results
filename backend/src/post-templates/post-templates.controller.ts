import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { PostTemplatesService } from './post-templates.service';
import { CreatePostTemplateDto } from './dto/create-post-template.dto';
import { UpdatePostTemplateDto } from './dto/update-post-template.dto';

@Controller('post-templates')
export class PostTemplatesController {
  constructor(private readonly postTemplatesService: PostTemplatesService) {}

  @Post()
  create(@Body() createPostTemplateDto: CreatePostTemplateDto) {
    return this.postTemplatesService.create(createPostTemplateDto);
  }

  @Get()
  findAll() {
    return this.postTemplatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postTemplatesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostTemplateDto: UpdatePostTemplateDto,
  ) {
    return this.postTemplatesService.update(id, updatePostTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postTemplatesService.remove(id);
  }
}