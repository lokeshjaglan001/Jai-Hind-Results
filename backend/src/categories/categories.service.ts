import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) { }

  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.categories.create({ data: createCategoryDto });
  }

  findAll() {
    return this.prisma.categories.findMany();
  }

  async findOne(id: number) {
    const category = await this.prisma.categories.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async findByName(name: string) {
    const category = await this.prisma.categories.findFirst({ where: { name } });
    if (!category) {
      throw new NotFoundException(`Category with name '${name}' not found`);
    }
    return category;
  }

  // NEW: Find category by slug (converts slug to name format)
  async findBySlug(slug: string) {
    // Convert slug to potential name formats
    // e.g., "haryana-jobs" -> "Haryana Jobs" or "haryana-jobs" -> "Haryana jobs"
    const nameFromSlug = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    // Try exact match first
    let category = await this.prisma.categories.findFirst({
      where: { name: nameFromSlug }
    });

    // If not found, try case-insensitive search
    if (!category) {
      category = await this.prisma.categories.findFirst({
        where: {
          name: {
            equals: nameFromSlug,
            mode: 'insensitive'
          }
        }
      });
    }

    if (!category) {
      throw new NotFoundException(`Category with slug '${slug}' not found`);
    }

    return category;
  }

  // NEW: Get category with its posts
  async findBySlugWithPosts(slug: string, page: number = 1, limit: number = 20) {
    const category = await this.findBySlug(slug);
    const skip = (page - 1) * limit;

    const [posts, total] = await this.prisma.$transaction([
      this.prisma.posts.findMany({
        where: { category_id: category.id },
        select: {
          id: true,
          title: true,
          slug: true,
          category_id: true,
          created_at: true,
          thumbnail_url: true,
          categories: {
            select: {
              name: true,
            },
          },
          post_tags: {
            select: {
              tags: {
                select: { name: true, id: true },
              },
            },
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.posts.count({ where: { category_id: category.id } }),
    ]);

    return {
      category,
      posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prisma.categories.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.categories.delete({ where: { id } });
  }
}