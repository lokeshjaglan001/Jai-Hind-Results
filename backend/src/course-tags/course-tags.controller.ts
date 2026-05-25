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
import { CourseTagsService } from './course-tags.service';
import { CreateCourseTagDto } from './dto/create-course-tag.dto';
import { UpdateCourseTagDto } from './dto/update-course-tag.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('course-tags')
export class CourseTagsController {
  constructor(private readonly courseTagsService: CourseTagsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createCourseTagDto: CreateCourseTagDto) {
    return this.courseTagsService.create(createCourseTagDto);
  }

  @Get() // Public route? Or admin only? Adjust guards as needed.
  findAll() {
    return this.courseTagsService.findAll();
  }

  @Get(':id') // Public route? Or admin only? Adjust guards as needed.
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseTagsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseTagDto: UpdateCourseTagDto,
  ) {
    return this.courseTagsService.update(id, updateCourseTagDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.courseTagsService.remove(id);
  }
}