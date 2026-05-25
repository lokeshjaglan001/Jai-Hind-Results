import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseCategoryDto } from './dto/create-course-category.dto';
import { UpdateCourseCategoryDto } from './dto/update-course-category.dto';
import { slugify } from '../utils/slugify';

@Injectable()
export class CourseCategoriesService {
  constructor(private prisma: PrismaService) {}

  create(createCourseCategoryDto: CreateCourseCategoryDto) {
    const { name, description } = createCourseCategoryDto;
    const slug = slugify(name);
    return this.prisma.course_categories.create({
      data: {
        name,
        description,
        slug,
      },
    });
  }

  findAll() {
    return this.prisma.course_categories.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.course_categories.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Course Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCourseCategoryDto: UpdateCourseCategoryDto) {
    await this.findOne(id);
    const data: any = { ...updateCourseCategoryDto };
    if (updateCourseCategoryDto.name) {
      data.slug = slugify(updateCourseCategoryDto.name);
    }
    return this.prisma.course_categories.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    // Add logic here if you need to handle courses linked to this category before deleting
    return this.prisma.course_categories.delete({ where: { id } });
  }
}