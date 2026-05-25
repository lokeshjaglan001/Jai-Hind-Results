import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CourseCategoriesService } from './course-categories.service';
import { CreateCourseCategoryDto } from './dto/create-course-category.dto';
import { UpdateCourseCategoryDto } from './dto/update-course-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('course-categories')
export class CourseCategoriesController {
  constructor(
    private readonly courseCategoriesService: CourseCategoriesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createCourseCategoryDto: CreateCourseCategoryDto) {
    return this.courseCategoriesService.create(createCourseCategoryDto);
  }

  @Get() // Public route? Or admin only? Adjust guards as needed.
  findAll() {
    return this.courseCategoriesService.findAll();
  }

  @Get(':id') // Public route? Or admin only? Adjust guards as needed.
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseCategoriesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseCategoryDto: UpdateCourseCategoryDto,
  ) {
    return this.courseCategoriesService.update(id, updateCourseCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.courseCategoriesService.remove(id);
  }
}