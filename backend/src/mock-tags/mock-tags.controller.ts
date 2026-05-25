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
import { MockTagsService } from './mock-tags.service';
import { CreateMockTagDto } from './dto/create-mock-tag.dto';
import { UpdateMockTagDto } from './dto/update-mock-tag.dto';

@Controller('mock-tags')
export class MockTagsController {
  constructor(private readonly mockTagsService: MockTagsService) {}

  @Post()
  create(@Body() createMockTagDto: CreateMockTagDto) {
    return this.mockTagsService.create(createMockTagDto);
  }

  @Get()
  findAll() {
    return this.mockTagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mockTagsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMockTagDto: UpdateMockTagDto,
  ) {
    return this.mockTagsService.update(id, updateMockTagDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mockTagsService.remove(id);
  }
}