import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards, 
  Req,
  UseInterceptors, // Add this
  UploadedFile,     // Add this
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // Add this
import { MockSeriesService } from './mock-series.service';
import { CreateMockSeriesDto } from './dto/create-mock-series.dto';
import { UpdateMockSeriesDto } from './dto/update-mock-series.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SupabaseService } from '../supabase/supabase.service'; // Add this
import type { Request } from 'express';

@Controller('mock-series')
export class MockSeriesController {
  constructor(
    private readonly mockSeriesService: MockSeriesService,
    private readonly supabaseService: SupabaseService, // Inject SupabaseService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file')) // Handle 'file' upload
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMockSeriesDto: CreateMockSeriesDto
  ) {
    if (file) {
      const bucket = 'thumbnails';
      const path = 'mock-series';
      const publicUrl = await this.supabaseService.uploadFile(file, bucket, path);
      createMockSeriesDto.thumbnail_url = publicUrl; // Add URL to the DTO
    }
    return this.mockSeriesService.create(createMockSeriesDto);
  }

  @Get('slug/:categorySlug/:seriesSlug')
  findBySlugs(
    @Param('categorySlug') categorySlug: string,
    @Param('seriesSlug') seriesSlug: string,
  ) {
    return this.mockSeriesService.findBySlugs(categorySlug, seriesSlug);
  }

  @Get()
  findAll() {
    return this.mockSeriesService.findAll();
  }

  @Post(':seriesId/tests/:testId')
  addTestToSeries(
    @Param('seriesId', ParseIntPipe) seriesId: number,
    @Param('testId', ParseIntPipe) testId: number,
  ) {
    return this.mockSeriesService.addTestToSeries(seriesId, testId);
  }

  @Delete(':seriesId/tests/:testId')
  removeTestFromSeries(
    @Param('seriesId', ParseIntPipe) seriesId: number,
    @Param('testId', ParseIntPipe) testId: number,
  ) {
    return this.mockSeriesService.removeTestFromSeries(seriesId, testId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mockSeriesService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateMockSeriesDto: UpdateMockSeriesDto,
  ) {
    
    if (file) {
      const bucket = 'thumbnails';
      const path = 'mock-series'; // Or another path for updates if desired
      const publicUrl = await this.supabaseService.uploadFile(file, bucket, path);
      updateMockSeriesDto.thumbnail_url = publicUrl; // Add/overwrite the URL in the DTO
    }

    return this.mockSeriesService.update(id, updateMockSeriesDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mockSeriesService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/check-enrollment')
  checkEnrollment(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.mockSeriesService.checkEnrollment(id, user.id);
  }
}