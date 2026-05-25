// src/upload/upload.controller.ts

import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from '../supabase/supabase.service'; // Ensure this path is correct

@Controller('upload')
export class UploadController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Post('thumbnail')
  @UseInterceptors(FileInterceptor('file'))
  async uploadThumbnail(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    const bucket = 'thumbnails';
    const path = 'images';

    const publicUrl = await this.supabaseService.uploadFile(file, bucket, path);

    return { url: publicUrl };
  }
}