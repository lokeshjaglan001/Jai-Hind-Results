import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMockTestDto } from './dto/create-mock-test.dto';
import { UpdateMockTestDto } from './dto/update-mock-test.dto';
import { slugify } from '../utils/slugify';

@Injectable()
export class MockTestsService {
  constructor(private prisma: PrismaService) {}

  create(createMockTestDto: CreateMockTestDto) {
    const { title } = createMockTestDto;
    const slug = slugify(title);
    return this.prisma.mock_tests.create({
      data: {
        ...createMockTestDto,
        slug,
      },
    });
  }

  findAll() {
    return this.prisma.mock_tests.findMany({
      include: { mock_series_tests: { include: { series: true } } },
    });
  }

  async findOne(id: number) {
    const test = await this.prisma.mock_tests.findUnique({
      where: { id },
      include: { 
        mock_questions: true,
        mock_series_tests: { include: { series: true } } 
      },
    });

    if (!test) {
      throw new NotFoundException(`Mock Test with ID ${id} not found`);
    }

    // Calculate actual total marks from questions
    if (test.mock_questions && test.mock_questions.length > 0) {
      const actualTotalMarks = test.mock_questions.reduce(
        (sum, q) => sum + (q.marks || 1),
        0
      );
      test.total_marks = actualTotalMarks;
    }

    return test;
  }

  async findBySlug(slug: string) {
    const seriesTest = await this.prisma.mock_series_tests.findUnique({
        where: { slug },
        include: {
            test: {
                include: {
                    mock_questions: true
                }
            },
            series: {
                include: {
                    mock_categories: true
                }
            }
        }
    });

    if (!seriesTest) {
        throw new NotFoundException(`Test with slug "${slug}" not found`);
    }

    // Calculate actual total marks from questions
    if (seriesTest.test && seriesTest.test.mock_questions && seriesTest.test.mock_questions.length > 0) {
      const actualTotalMarks = seriesTest.test.mock_questions.reduce(
        (sum, q) => sum + (q.marks || 1),
        0
      );
      seriesTest.test.total_marks = actualTotalMarks;
    }

    return seriesTest;
  }

  async update(id: number, updateMockTestDto: UpdateMockTestDto) {
    await this.findOne(id);
    const data: any = { ...updateMockTestDto };
    if (updateMockTestDto.title) {
      data.slug = slugify(updateMockTestDto.title);
    }

    const updatedTest = await this.prisma.mock_tests.update({
      where: { id },
      data,
    });

    const seriesTests = await this.prisma.mock_series_tests.findMany({
        where: { test_id: id },
        include: {
            series: {
                include: {
                    mock_categories: true
                }
            }
        }
    });

    for (const seriesTest of seriesTests) {
        const categorySlug = seriesTest.series.mock_categories?.slug ?? 'unknown-category';
        const newSlug = `${categorySlug}/${seriesTest.series.slug}/${updatedTest.slug}`;
        await this.prisma.mock_series_tests.update({
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

    return updatedTest;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.mock_tests.delete({ where: { id } });
  }

  async submitTest(testId: number, userId: number, answers: Record<string, string>) {
    const questions = await this.prisma.mock_questions.findMany({
      where: { test_id: testId },
    });

    if (questions.length === 0) {
      throw new NotFoundException('No questions found for this test.');
    }

    // Calculate actual total marks from questions
    const actualTotalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);

    let score = 0;
    for (const question of questions) {
      const userAnswer = answers[question.id.toString()];
      if (userAnswer && userAnswer === question.correct_answer) {
        score += question.marks || 1;
      }
    }

    // Update the test's total_marks to reflect actual question marks
    await this.prisma.mock_tests.update({
      where: { id: testId },
      data: { total_marks: actualTotalMarks },
    });

    return this.prisma.mock_attempts.create({
      data: {
        test_id: testId,
        user_id: userId,
        answers: answers as any,
        score,
        completed_at: new Date(),
      },
    });
  }

  async findAttempt(attemptId: number, userId: number) {
    const attempt = await this.prisma.mock_attempts.findUnique({
      where: { id: attemptId },
      include: {
        mock_tests: {
          include: {
            mock_questions: true,
          },
        },
        users: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException(`Attempt with ID ${attemptId} not found`);
    }

    // Check if the attempt belongs to the requesting user
    if (attempt.user_id !== BigInt(userId)) {
      throw new NotFoundException(`Attempt not found`);
    }

    // Calculate actual total marks from questions (in case it's not updated)
    if (attempt.mock_tests && attempt.mock_tests.mock_questions) {
      const actualTotalMarks = attempt.mock_tests.mock_questions.reduce(
        (sum, q) => sum + (q.marks || 1),
        0
      );
      
      // Update the total_marks in the response to reflect actual question marks
      attempt.mock_tests.total_marks = actualTotalMarks;
    }

    return attempt;
  }
}