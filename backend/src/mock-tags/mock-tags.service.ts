import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMockTagDto } from './dto/create-mock-tag.dto';
import { UpdateMockTagDto } from './dto/update-mock-tag.dto';

@Injectable()
export class MockTagsService {
  constructor(private prisma: PrismaService) {}

  create(createMockTagDto: CreateMockTagDto) {
    return this.prisma.mock_tags.create({ data: createMockTagDto });
  }

  findAll() {
    return this.prisma.mock_tags.findMany();
  }

  async findOne(id: number) {
    const mockTag = await this.prisma.mock_tags.findUnique({ where: { id } });
    if (!mockTag) {
      throw new NotFoundException(`Mock Tag with ID ${id} not found`);
    }
    return mockTag;
  }

  async update(id: number, updateMockTagDto: UpdateMockTagDto) {
    await this.findOne(id);
    return this.prisma.mock_tags.update({
      where: { id },
      data: updateMockTagDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.mock_tags.delete({ where: { id } });
  }
}