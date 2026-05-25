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
  Query,
} from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { CreateCarouselDto } from './dto/create-carousel.dto';
import { UpdateCarouselDto } from './dto/update-carousel.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('carousel')
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  // --- ADMIN-ONLY ROUTES (CRUD) ---

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createCarouselDto: CreateCarouselDto) {
    return this.carouselService.create(createCarouselDto);
  }

  @Get('all') // Admin route to get ALL items
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAllAdmin() {
    return this.carouselService.findAll(false);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCarouselDto: UpdateCarouselDto,
  ) {
    return this.carouselService.update(id, updateCarouselDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carouselService.remove(id);
  }

  // --- PUBLIC ROUTE ---

  @Get() // Public route to get only active items
  findAllActive() {
    return this.carouselService.findAll(true);
  }

  // Admin can also get a single item by ID if needed
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carouselService.findOne(id);
  }
}