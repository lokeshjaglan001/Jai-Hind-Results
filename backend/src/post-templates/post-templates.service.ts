import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostTemplateDto } from './dto/create-post-template.dto';
import { UpdatePostTemplateDto } from './dto/update-post-template.dto';

@Injectable()
export class PostTemplatesService {
  constructor(private prisma: PrismaService) {}

  create(createPostTemplateDto: CreatePostTemplateDto) {
    return this.prisma.post_templates.create({ data: createPostTemplateDto });
  }

  findAll() {
    return this.prisma.post_templates.findMany();
  }

  async findOne(id: number) {
    const postTemplate = await this.prisma.post_templates.findUnique({
      where: { id },
    });
    if (!postTemplate) {
      throw new NotFoundException(`Post Template with ID ${id} not found`);
    }
    return postTemplate;
  }

  async update(id: number, updatePostTemplateDto: UpdatePostTemplateDto) {
    await this.findOne(id);
    return this.prisma.post_templates.update({
      where: { id },
      data: updatePostTemplateDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.post_templates.delete({ where: { id } });
  }
}