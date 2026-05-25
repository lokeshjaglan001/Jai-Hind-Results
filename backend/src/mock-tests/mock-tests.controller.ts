import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { MockTestsService } from './mock-tests.service';
import { CreateMockTestDto } from './dto/create-mock-test.dto';
import { UpdateMockTestDto } from './dto/update-mock-test.dto';
import { UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubmitTestDto } from './dto/submit-test.dto';
import type { Request } from 'express';

@Controller('mock-tests')
export class MockTestsController {
  constructor(private readonly mockTestsService: MockTestsService) {}

  @Get(':categorySlug/:seriesSlug/:testSlug')
  findBySlug(
    @Param('categorySlug') categorySlug: string,
    @Param('seriesSlug') seriesSlug: string,
    @Param('testSlug') testSlug: string,
    ) {
        const slug = `${categorySlug}/${seriesSlug}/${testSlug}`;
        return this.mockTestsService.findBySlug(slug);
  }

  @Post()
  create(@Body() createMockTestDto: CreateMockTestDto) {
    return this.mockTestsService.create(createMockTestDto);
  }

  @Get()
  findAll() {
    return this.mockTestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mockTestsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMockTestDto: UpdateMockTestDto,
  ) {
    return this.mockTestsService.update(id, updateMockTestDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mockTestsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  submitTest(
    @Param('id', ParseIntPipe) id: number,
    @Body() submitTestDto: SubmitTestDto,
    @Req() req: Request,
  ) {
    const user = req.user as any; // The user object is attached by the JwtAuthGuard
    return this.mockTestsService.submitTest(id, user.id, submitTestDto.answers);
  }

  @UseGuards(JwtAuthGuard)
  @Get('attempts/:id')
  getAttempt(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.mockTestsService.findAttempt(id, user.id);
  }
}