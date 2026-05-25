import { 
  Controller, 
  Post, 
  Body, 
  Req, 
  UseGuards, 
  Get, 
  Param, 
  Put, 
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { SubmitFormDto } from './dto/submit-form.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import type { Request } from 'express';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  // Admin: Create form
  @Post()
  createForm(@Body() dto: CreateFormDto) {
    return this.formsService.createForm(dto);
  }

  // Public: Get all published forms
  @Get()
  getForms() {
    return this.formsService.getForms();
  }

  // Admin: Get all forms (including drafts)
  @Get('admin/all')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAllForms() {
    return this.formsService.getAllForms();
  }

  // Get form by slug
  @Get('slug/:slug')
  getFormBySlug(@Param('slug') slug: string) {
    return this.formsService.getFormBySlug(slug);
  }

  // Get form by ID (admin)
  @Get(':id')
  getFormById(@Param('id') id: string) {
    return this.formsService.getFormById(id);
  }

  // Admin: Update form
  @Put(':id')
  updateForm(@Param('id') id: string, @Body() dto: UpdateFormDto) {
    return this.formsService.updateForm(id, dto);
  }

  // Admin: Delete form
  @Delete(':id')
  deleteForm(@Param('id') id: string) {
    return this.formsService.deleteForm(id);
  }

  // Check if user has already submitted
  @Get(':formId/check-submission/:userId')
  checkUserSubmission(
    @Param('formId') formId: string,
    @Param('userId') userId: string
  ) {
    return this.formsService.checkUserSubmission(formId, parseInt(userId));
  }

  // Submit form with file uploads
  @Post('submit')
  @UseInterceptors(AnyFilesInterceptor())
  submitForm(
    @Body() dto: SubmitFormDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request
  ) {
    const user = req.user as any;
    return this.formsService.submitForm(dto, files);
  }

  // Verify payment
  @Post('verify-payment')
  verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.formsService.verifyPayment(dto);
  }

  // Admin: Get submissions for a form
  @Get(':formId/submissions')
  getFormSubmissions(
    @Param('formId') formId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 50;
    return this.formsService.getFormSubmissions(formId, pageNum, limitNum);
  }

  // Admin: Get submission by ID
  @Get('submissions/:submissionId')
  getSubmissionById(@Param('submissionId') submissionId: string) {
    return this.formsService.getSubmissionById(submissionId);
  }
}