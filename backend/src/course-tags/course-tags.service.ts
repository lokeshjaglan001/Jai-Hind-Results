import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseTagDto } from './dto/create-course-tag.dto';
import { UpdateCourseTagDto } from './dto/update-course-tag.dto';
import { slugify } from '../utils/slugify';

@Injectable()
export class CourseTagsService {
  constructor(private prisma: PrismaService) {}

  create(createCourseTagDto: CreateCourseTagDto) {
    const { name } = createCourseTagDto;
    const slug = slugify(name);
    return this.prisma.course_tags.create({
      data: {
        name,
        slug,
      },
    });
  }

  findAll() {
    return this.prisma.course_tags.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const tag = await this.prisma.course_tags.findUnique({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Course Tag with ID ${id} not found`);
    }
    return tag;
  }

  async update(id: number, updateCourseTagDto: UpdateCourseTagDto) {
    await this.findOne(id);
    const data: any = { ...updateCourseTagDto };
    if (updateCourseTagDto.name) {
      data.slug = slugify(updateCourseTagDto.name);
    }
    return this.prisma.course_tags.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.course_tags.delete({ where: { id } });
  }
}