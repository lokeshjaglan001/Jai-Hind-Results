import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';
import { MockCategoriesService } from './mock-categories.service';
import { CreateMockCategoryDto } from './dto/create-mock-category.dto';
import { UpdateMockCategoryDto } from './dto/update-mock-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('mock-categories')
export class MockCategoriesController {
  constructor(private readonly mockCategoriesService: MockCategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createMockCategoryDto: CreateMockCategoryDto) {
    return this.mockCategoriesService.create(createMockCategoryDto);
  }

  @Get()
  findAll() {
    return this.mockCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mockCategoriesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMockCategoryDto: UpdateMockCategoryDto,
  ) {
    return this.mockCategoriesService.update(id, updateMockCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mockCategoriesService.remove(id);
  }
}