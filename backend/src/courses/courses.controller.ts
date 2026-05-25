import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query, // Import Query decorator
  Req,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import type { Request } from 'express'; // <-- Import Request type
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SupabaseService } from '../supabase/supabase.service';
import { CourseStatus } from '@prisma/client';
import { ReorderTopicsDto } from './dto/reorder-topics.dto';
import { ReorderLessonsDto } from './dto/reorder-lessons.dto';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly supabaseService: SupabaseService, // Inject if not already done
  ) {}

  // ======================================
  // Course Routes
  // ======================================

  @UseGuards(JwtAuthGuard) // Protect with JWT authentication
  @Get('user/enrollments')
  getUserEnrollments(
    @Req() req: Request, // Inject the request object
  ) {
    const user = req.user as any;
    if (!user || !user.id) {
      throw new BadRequestException('User information not found in request.');
    }
    return this.coursesService.findUserEnrollments(user.id);
  }

  @UseGuards(JwtAuthGuard) // Protect with JWT authentication
  @Get(':id/check-enrollment')
  checkEnrollment(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request, // Inject the request object
  ) {
    // The user object is attached to the request by JwtAuthGuard/JwtStrategy
    const user = req.user as any;
    // Ensure user object and ID exist before proceeding
    if (!user || !user.id) {
        throw new BadRequestException('User information not found in request.');
    }
    return this.coursesService.checkEnrollment(id, user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('thumbnailFile')) // Handle thumbnail upload
  async createCourse(
    @UploadedFile() thumbnailFile: Express.Multer.File,
    @Body() createCourseDto: CreateCourseDto,
  ) {
    if (thumbnailFile) {
      const bucket = 'thumbnails'; // Define your bucket
      const path = 'courses'; // Define your path
      const publicUrl = await this.supabaseService.uploadFile(
        thumbnailFile,
        bucket,
        path,
      );
      createCourseDto.thumbnail_url = publicUrl;
    }
    return this.coursesService.createCourse(createCourseDto);
  }

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard) // Protect with JWT authentication
  @HttpCode(HttpStatus.OK) // Return 200 OK on success instead of 201 Created
  async enrollFreeCourse(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request, // Inject the request object
  ) {
    const user = req.user as any;
    if (!user || !user.id) {
      throw new BadRequestException('User information not found in request.');
    }
    // No request body needed, just course ID from URL and user ID from token
    return this.coursesService.enrollFreeCourse(id, user.id);
  }

  @Get() // Public route to get published courses
  findAllCourses(@Query('status') status?: CourseStatus) {
    // Allow optional filtering by status (e.g., /courses?status=draft for admins)
    // Add guards if you want to restrict viewing drafts to admins
    return this.coursesService.findAllCourses(status);
  }

  // Get by ID (Admin/Internal use)
  @Get('id/:id')
  @UseGuards(JwtAuthGuard, RolesGuard) // Example: Protect ID route for admins
  @Roles('admin')
  findCourseById(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findCourseByIdOrSlug(id);
  }

  // Get by Slug (Public)
  @Get('slug/:slug')
  findCourseBySlug(@Param('slug') slug: string) {
    return this.coursesService.findCourseByIdOrSlug(slug);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('thumbnailFile')) // Handle thumbnail update
  async updateCourse(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() thumbnailFile: Express.Multer.File,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    if (thumbnailFile) {
      const bucket = 'thumbnails';
      const path = 'courses';
      const publicUrl = await this.supabaseService.uploadFile(
        thumbnailFile,
        bucket,
        path,
      );
      updateCourseDto.thumbnail_url = publicUrl;
    }
    return this.coursesService.updateCourse(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteCourse(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.deleteCourse(id);
  }

  // ======================================
  // Topic Routes (Nested under Courses)
  // ======================================

  @Post(':courseId/topics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createTopic(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() createTopicDto: CreateTopicDto,
  ) {
    return this.coursesService.createTopic(courseId, createTopicDto);
  }

  @Get(':courseId/topics')
  // Add guards based on whether only admins or enrolled users can see topics
  findTopicsByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.coursesService.findTopicsByCourse(courseId);
  }

  @Put('topics/:topicId') // Using separate path for topic update/delete
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateTopic(
    @Param('topicId', ParseIntPipe) topicId: number,
    @Body() updateTopicDto: UpdateTopicDto,
  ) {
    return this.coursesService.updateTopic(topicId, updateTopicDto);
  }

  @Delete('topics/:topicId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteTopic(@Param('topicId', ParseIntPipe) topicId: number) {
    return this.coursesService.deleteTopic(topicId);
  }

  @Patch(':courseId/topics/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  reorderTopics(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() reorderTopicsDto: ReorderTopicsDto,
  ) {
    return this.coursesService.reorderTopics(courseId, reorderTopicsDto);
    }

  // ======================================
  // Lesson Routes (Nested under Topics)
  // ======================================

  @Post('topics/:topicId/lessons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('featuredImageFile')) // Handle featured image
  async createLesson(
    @Param('topicId', ParseIntPipe) topicId: number,
    @UploadedFile() featuredImageFile: Express.Multer.File,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    if (featuredImageFile) {
      const bucket = 'images'; // Or specific lesson images bucket
      const path = 'lessons';
      const publicUrl = await this.supabaseService.uploadFile(
        featuredImageFile,
        bucket,
        path,
      );
      createLessonDto.featured_image_url = publicUrl;
    }
    return this.coursesService.createLesson(topicId, createLessonDto);
  }

  // Get lessons for a topic (usually done via get topics endpoint)
  // Might not need a dedicated GET /lessons endpoint initially

  @Put('lessons/:lessonId') // Using separate path for lesson update/delete
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('featuredImageFile')) // Handle image update
  async updateLesson(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @UploadedFile() featuredImageFile: Express.Multer.File,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    if (featuredImageFile) {
      const bucket = 'images';
      const path = 'lessons';
      const publicUrl = await this.supabaseService.uploadFile(
        featuredImageFile,
        bucket,
        path,
      );
      updateLessonDto.featured_image_url = publicUrl;
    }
    return this.coursesService.updateLesson(lessonId, updateLessonDto);
  }

  @Delete('lessons/:lessonId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteLesson(@Param('lessonId', ParseIntPipe) lessonId: number) {
    return this.coursesService.deleteLesson(lessonId);
  }

  @Patch('topics/:topicId/lessons/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  reorderLessons(
    @Param('topicId', ParseIntPipe) topicId: number,
    @Body() reorderLessonsDto: ReorderLessonsDto,
  ) {
    return this.coursesService.reorderLessons(topicId, reorderLessonsDto);
  }
}