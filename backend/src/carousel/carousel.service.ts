import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarouselDto } from './dto/create-carousel.dto';
import { UpdateCarouselDto } from './dto/update-carousel.dto';

@Injectable()
export class CarouselService {
  constructor(private prisma: PrismaService) { }

  async create(createCarouselDto: CreateCarouselDto) {
    return this.prisma.carousel_texts.create({ data: createCarouselDto });
  }

  findAll(onlyActive: boolean = false) {
    return this.prisma.carousel_texts.findMany({
      where: onlyActive ? { is_active: true } : {},
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        text: true,
        // Add link if it exists in your schema, otherwise remove
        // link: true, 
      }
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.carousel_texts.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Carousel item with ID ${id} not found`);
    }
    return item;
  }

  async update(id: number, updateCarouselDto: UpdateCarouselDto) {
    await this.findOne(id);

    return this.prisma.carousel_texts.update({
      where: { id },
      data: updateCarouselDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.carousel_texts.delete({ where: { id } });
  }
}