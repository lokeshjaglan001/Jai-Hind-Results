import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMockSeriesDto } from './dto/create-mock-series.dto';
import { UpdateMockSeriesDto } from './dto/update-mock-series.dto';
import { slugify } from '../utils/slugify';

@Injectable()
export class MockSeriesService {
  constructor(private prisma: PrismaService) {}

  async create(createMockSeriesDto: CreateMockSeriesDto) {
    const { tagIds, category_id, title, ...seriesData } = createMockSeriesDto;
    const slug = slugify(title);

    return this.prisma.mock_series.create({
      data: {
        ...seriesData,
        title,
        slug,
        mock_categories: {
          connect: { id: category_id },
        },
        mock_series_tags: tagIds
          ? {
              create: tagIds.map((id) => ({
                tag: {
                  connect: { id },
                },
              })),
            }
          : undefined,
      },
      include: {
        mock_categories: true,
        mock_series_tags: { include: { tag: true } },
      },
    });
  }

  async findAll() {
    const series = await this.prisma.mock_series.findMany({
      include: {
        mock_categories: true,
        mock_series_tags: { include: { tag: true } },
        mock_series_tests: { include: { test: true } },
      },
    });

    if (series.length === 0) {
      return [];
    }

    const paymentCounts = await this.prisma.payments.groupBy({
      by: ['mock_series_id'],
      where: {
        status: 'success',
        mock_series_id: {
          in: series.map(s => s.id),
        },
      },
      _count: {
        mock_series_id: true,
      },
    });

    // Build a map from series ID (number) to count, filtering out null keys and converting BigInt to number
    const countsMap = new Map<number, number>(
      paymentCounts
        .filter(count => count.mock_series_id !== null)
        .map((count) => [Number(count.mock_series_id), Number(count._count.mock_series_id)] as [number, number]),
    );

    return series.map(s => ({
      ...s,
      enrolled_users_count: countsMap.get(Number(s.id)) || 0,
    }));
  }

  async findOne(id: number) {
    const series = await this.prisma.mock_series.findUnique({
      where: { id },
      include: {
        mock_categories: true,
        mock_series_tags: { include: { tag: true } },
        mock_series_tests: { include: { test: true } },
      },
    });

    if (!series) {
      throw new NotFoundException(`Mock Series with ID ${id} not found`);
    }

    const enrolled_users_count = await this.prisma.payments.count({
      where: {
        mock_series_id: id,
        status: 'success',
      },
    });

    return { ...series, enrolled_users_count };
  }

  async findBySlugs(categorySlug: string, seriesSlug: string) {
    const series = await this.prisma.mock_series.findFirst({
      where: {
        slug: seriesSlug,
        mock_categories: {
          slug: categorySlug,
        },
      },
      include: {
        mock_categories: true,
        mock_series_tags: { include: { tag: true } },
        mock_series_tests: {
          include: {
            test: true,
          },
        },
      },
    });

    if (!series) {
      throw new NotFoundException(
        `Series with slug "${seriesSlug}" in category "${categorySlug}" not found`,
      );
    }

    const enrolled_users_count = await this.prisma.payments.count({
      where: {
        mock_series_id: series.id,
        status: 'success',
      },
    });

    return { ...series, enrolled_users_count };
  }

  async addTestToSeries(seriesId: number, testId: number) {
    const series = await this.prisma.mock_series.findUnique({
        where: { id: seriesId },
        include: { mock_categories: true }
    });
    if (!series) {
        throw new NotFoundException(`Mock Series with ID ${seriesId} not found`);
    }

    const test = await this.prisma.mock_tests.findUnique({
        where: { id: testId }
    });
    if (!test) {
        throw new NotFoundException(`Mock Test with ID ${testId} not found`);
    }

    if (!series.mock_categories) {
      throw new NotFoundException(`Mock Category for Series ID ${seriesId} not found`);
    }
    const slug = `${slugify(series.mock_categories.name)}/${series.slug}/${test.slug}`;

    return this.prisma.mock_series_tests.create({
      data: {
        series_id: seriesId,
        test_id: testId,
        slug,
      },
    });
  }

  // NEW: Method to remove a test from a series (without deleting the test)
  async removeTestFromSeries(seriesId: number, testId: number) {
    return this.prisma.mock_series_tests.delete({
      where: {
        series_id_test_id: {
          series_id: seriesId,
          test_id: testId,
        },
      },
    });
  }

  async update(id: number, updateMockSeriesDto: UpdateMockSeriesDto) {
    const { tagIds, title, ...seriesData } = updateMockSeriesDto;

    return this.prisma.$transaction(async (tx) => {
      // Fetch the current series with its category to ensure we have the slug
      const currentSeries = await tx.mock_series.findUnique({
          where: { id },
          include: { mock_categories: true }
      });

      if (!currentSeries) {
          throw new NotFoundException(`Mock Series with ID ${id} not found`);
      }

      const updatedSeries = await tx.mock_series.update({
        where: { id },
        data: {
          ...seriesData,
          ...(title && { title: title, slug: slugify(title) }),
        },
        include: {
            mock_categories: true,
        },
      });

      if (tagIds) {
        await tx.mock_series_tags.deleteMany({ where: { series_id: id } });
        await tx.mock_series_tags.createMany({
          data: tagIds.map((tagId) => ({
            series_id: id,
            tag_id: tagId,
          })),
        });
      }

      // If the series title or category changes, update the slugs in mock_series_tests
      if (title || seriesData.category_id) {
          const seriesTests = await tx.mock_series_tests.findMany({
              where: { series_id: id },
              include: { test: true }
          });

          for (const seriesTest of seriesTests) {
              if (!updatedSeries.mock_categories) {
                throw new NotFoundException(`Mock Category for updated Series ID ${id} not found`);
              }
              const newSlug = `${updatedSeries.mock_categories.slug}/${updatedSeries.slug}/${seriesTest.test.slug}`;
              await tx.mock_series_tests.update({
                  where: {
                      series_id_test_id: {
                          series_id: seriesTest.series_id,
                          test_id: seriesTest.test_id
                      }
                  },
                  data: {
                      slug: newSlug
                  }
              });
          }
      }

      return tx.mock_series.findUnique({
        where: { id },
        include: {
          mock_categories: true,
          mock_series_tags: { include: { tag: true } },
        },
      });
    });
  }

  // src/mock-series/mock-series.service.ts

async remove(id: number) {
  await this.findOne(id); // First, ensure the series exists

  // Use a transaction to safely delete the series and its dependencies
  return this.prisma.$transaction(async (tx) => {
    // 1. Delete the connections in the join tables first
    await tx.mock_series_tags.deleteMany({
      where: { series_id: id },
    });
    await tx.mock_series_tests.deleteMany({
      where: { series_id: id },
    });

    // 2. Handle related payments. Here, we'll detach them from the series
    //    by setting the mock_series_id to null.
    await tx.payments.updateMany({
      where: { mock_series_id: id },
      data: { mock_series_id: null },
    });

    // 3. Now it's safe to delete the actual series
    const deletedSeries = await tx.mock_series.delete({
      where: { id },
    });

    return deletedSeries;
  });
}

  async checkEnrollment(seriesId: number, userId: number) {
    const payment = await this.prisma.payments.findFirst({
      where: {
        user_id: userId,
        mock_series_id: seriesId,
        status: 'success', // Check for a successful payment
      },
    });

    return { enrolled: !!payment }; // Returns { enrolled: true } if a payment exists, otherwise false
  }
}