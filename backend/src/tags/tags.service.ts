import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  create(createTagDto: CreateTagDto) {
    return this.prisma.tags.create({ data: createTagDto });
  }

  findAll() {
    return this.prisma.tags.findMany();
  }

  async findOne(id: number) {
    const tag = await this.prisma.tags.findUnique({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    await this.findOne(id);
    return this.prisma.tags.update({
      where: { id },
      data: updateTagDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.tags.delete({ where: { id } });
  }
}