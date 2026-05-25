import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    HttpCode,
    HttpStatus
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MockQuestionsService } from './mock-questions.service';
import { CreateMockQuestionDto } from './dto/create-mock-question.dto';
import { UpdateMockQuestionDto } from './dto/update-mock-question.dto';
import { BulkCreateMockQuestionDto } from './dto/bulk-create-mock-questions.dto';

@Controller('mock-questions')
export class MockQuestionsController {
  constructor(private readonly mockQuestionsService: MockQuestionsService) {}

  @Post('upload/csv')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: BulkCreateMockQuestionDto
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }
    if (!file.mimetype.includes('csv')) {
        throw new BadRequestException('Invalid file type. Please upload a CSV.');
    }
    
    const testId = Number(body.test_id);
    if (isNaN(testId)) {
        throw new BadRequestException('Invalid test_id.');
    }

    const csvContent = file.buffer.toString();
    return this.mockQuestionsService.bulkCreateFromCsv(csvContent, testId);
  }

  @Post()
  create(@Body() createMockQuestionDto: CreateMockQuestionDto) {
    return this.mockQuestionsService.create(createMockQuestionDto);
  }

  @Get()
  findAll() {
    return this.mockQuestionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mockQuestionsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMockQuestionDto: UpdateMockQuestionDto,
  ) {
    return this.mockQuestionsService.update(id, updateMockQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mockQuestionsService.remove(id);
  }
}