import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  // IMPORTANT: Specific routes MUST come before generic :id routes
  // Otherwise :id will match "slug" as an id parameter

  @Get('name/:name')
  findByName(@Param('name') name: string) {
    return this.categoriesService.findByName(name);
  }

  // NEW: Get category by slug
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  // NEW: Get category with all its posts by slug
  @Get('slug/:slug/posts')
  findBySlugWithPosts(
    @Param('slug') slug: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = Number.isFinite(Number(page)) ? Number(page) : 1;
    const limitNumber = Number.isFinite(Number(limit)) ? Number(limit) : 20;
    return this.categoriesService.findBySlugWithPosts(slug, pageNumber, limitNumber);
  }

  // Generic :id route comes AFTER specific routes
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}