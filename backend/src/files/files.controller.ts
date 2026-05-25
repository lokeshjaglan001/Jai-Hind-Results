import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { PurchaseFileDto } from './dto/purchase-file.dto';
import { VerifyFilePaymentDto } from './dto/verify-file-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import type { Request } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // Public: Get all published files
  @Get()
  getPublishedFiles() {
    return this.filesService.getPublishedFiles();
  }

  // Admin: Get all files (including unpublished)
  @Get('admin/all')
  getAllFiles() {
    return this.filesService.getAllFiles();
  }

  // Admin: Create file
  @Post()
  createFile(@Body() dto: CreateFileDto) {
    return this.filesService.createFile(dto);
  }

  // Admin: Upload file to Supabase
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string
  ) {
    return this.filesService.uploadFileToStorage(file, folder);
  }

  // Public: Get file by slug
  @Get('slug/:slug')
  getFileBySlug(@Param('slug') slug: string) {
    return this.filesService.getFileBySlug(slug);
  }

  // Check if user has purchased file
  @Get(':fileId/check-purchase/:userId')
  checkUserPurchase(
    @Param('fileId') fileId: string,
    @Param('userId') userId: string
  ) {
    return this.filesService.checkUserPurchase(fileId, parseInt(userId));
  }

  // User: Purchase file (create Razorpay order)
  @Post('purchase')
  purchaseFile(@Body() dto: PurchaseFileDto, @Req() req: Request) {
    return this.filesService.purchaseFile(dto);
  }

  // User: Verify payment
  @Post('verify-payment')
  verifyPayment(@Body() dto: VerifyFilePaymentDto) {
    return this.filesService.verifyPayment(dto);
  }

  // User: Get my purchased files
  @Get('mine/:userId')
  getUserPurchasedFiles(@Param('userId') userId: string) {
    return this.filesService.getUserPurchasedFiles(parseInt(userId));
  }

  // Admin: Get file by ID
  @Get(':id')
  getFileById(@Param('id') id: string) {
    return this.filesService.getFileById(id);
  }

  // Admin: Update file
  @Put(':id')
  updateFile(@Param('id') id: string, @Body() dto: UpdateFileDto) {
    return this.filesService.updateFile(id, dto);
  }

  // Admin: Delete file
  @Delete(':id')
  deleteFile(@Param('id') id: string) {
    return this.filesService.deleteFile(id);
  }

  // Admin: Get file purchases
  @Get(':fileId/purchases')
  getFilePurchases(@Param('fileId') fileId: string) {
    return this.filesService.getFilePurchases(fileId);
  }

  // Admin: Get all payments
  @Get('admin/payments')
  getAllPayments() {
    return this.filesService.getAllPayments();
  }
}