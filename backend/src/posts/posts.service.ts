import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) { }

  async create(createPostDto: CreatePostDto, userId: number) {
    const { tags, ...postData } = createPostDto;

    return this.prisma.posts.create({
      data: {
        ...postData,
        // If postData.category_id is null (from DTO), Prisma sets it to NULL in DB
        content: postData.content_html || '',
        created_by: userId,
        post_tags: tags
          ? {
            create: tags.map((tagId) => ({
              tags: {
                connect: { id: tagId },
              },
            })),
          }
          : undefined,
      },
      include: {
        post_tags: {
          include: {
            tags: true,
          },
        },
      },
    });
  }

  async findAll(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;

    const whereClause = search
      ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }
      : {};

    const [posts, total] = await this.prisma.$transaction([
      this.prisma.posts.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          slug: true,
          created_at: true,
          published_at: true,
          thumbnail_url: true,
          category_id: true,
          description: true,
          categories: {
            select: { name: true },
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
      this.prisma.posts.count({ where: whereClause }),
    ]);

    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    // ... (unchanged findOne implementation) ...
    const post = await this.prisma.posts.findUnique({
      where: { id },
      include: {
        categories: true,
        post_templates: true,
        post_tags: { include: { tags: true } },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    // ... (unchanged update implementation logic) ...
    await this.findOne(id);
    const { tags, ...postData } = updatePostDto;

    return this.prisma.$transaction(async (tsx) => {
      // Handle Tags Update
      if (Array.isArray(tags)) {
        await tsx.post_tags.deleteMany({
          where: { post_id: id },
        });
      }

      // Update Post
      return tsx.posts.update({
        where: { id },
        data: {
          ...postData,
          // If postData.category_id is null, it sets DB column to NULL (removing category)
          post_tags:
            tags && tags.length > 0
              ? {
                create: tags.map((tagId) => ({
                  tags: {
                    connect: { id: tagId },
                  },
                })),
              }
              : undefined,
        },
        include: {
          categories: true,
          post_templates: true,
          post_tags: { include: { tags: true } },
        },
      });
    });
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.posts.findUnique({
      where: { slug },
      include: {
        categories: true,
        post_templates: true,
        post_tags: { include: { tags: true } },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }
    return post;
  }

  // ... (rest of your find functions remain the same) ...
  async findByCategory(categoryId: number) {
    return this.prisma.posts.findMany({
      where: { category_id: categoryId },
      select: {
        id: true,
        title: true,
        slug: true,
        created_at: true,
        published_at: true,
        thumbnail_url: true,
        category_id: true,
        description: true,
        categories: {
          select: { name: true },
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
    });
  }

  async findByTagName(tagName: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const whereClause = {
      post_tags: {
        some: {
          tags: {
            name: { equals: tagName, mode: 'insensitive' as const },
          },
        },
      },
    };

    const [posts, total] = await this.prisma.$transaction([
      this.prisma.posts.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          slug: true,
          created_at: true,
          published_at: true,
          thumbnail_url: true,
          category_id: true,
          description: true,
          categories: {
            select: { name: true },
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
      this.prisma.posts.count({ where: whereClause }),
    ]);

    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Search posts by query string.
   * Searches in title, description, category name, and tag names.
   */
  async search(query: string, limit = 50) {
    if (!query || query.trim() === '') {
      return [];
    }

    return this.prisma.posts.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          {
            categories: {
              name: { contains: query, mode: 'insensitive' },
            },
          },
          {
            post_tags: {
              some: {
                tags: {
                  name: { contains: query, mode: 'insensitive' },
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnail_url: true,
        created_at: true,
        categories: {
          select: {
            name: true,
          },
        },
        post_tags: {
          select: {
            tags: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  }

  async findLatestByCategory(categoryName: string, limit = 8) {
    return this.prisma.posts.findMany({
      where: {
        categories: {
          is: {
            name: { equals: categoryName, mode: 'insensitive' },
          },
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        category_id: true,
        created_at: true,
        // Add more fields if needed, but do NOT include html/content
      },
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  }

  /**
   * Return summarized posts (only select fields) for each category.
   * Useful for homepage cards where full HTML content is not needed.
   */
  async findSummaryByCategories(limit = 25, categoryNames?: string) {
    // Optimized: Fetch categories and their latest posts in a single query
    // distinct queries vs single query: Prisma handles 'take' inside relations efficiently

    const whereClause: any = {};
    if (categoryNames) {
      const names = categoryNames.split(',').map(n => n.trim());
      if (names.length > 0) {
        whereClause.name = { in: names };
      }
    }

    return this.prisma.categories.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        posts: {
          take: limit,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            title: true,
            slug: true,
            category_id: true,
            created_at: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.$transaction(async (tsx) => {
      await tsx.post_tags.deleteMany({ where: { post_id: id } });
      return tsx.posts.delete({ where: { id } });
    });
  }
}