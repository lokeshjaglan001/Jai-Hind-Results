import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMockQuestionDto } from './dto/create-mock-question.dto';
import { UpdateMockQuestionDto } from './dto/update-mock-question.dto';
import * as Papa from 'papaparse';
import { Prisma } from '@prisma/client'; // Use the main Prisma namespace

@Injectable()
export class MockQuestionsService {
  constructor(private prisma: PrismaService) {}

async bulkCreateFromCsv(csvContent: string, testId: number) {
    const test = await this.prisma.mock_tests.findUnique({ where: { id: testId } });
    if (!test) {
        throw new NotFoundException(`Mock Test with ID ${testId} not found.`);
    }

    const parsed = Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
    });

    if (parsed.errors.length) {
        throw new BadRequestException('Error parsing CSV file.');
    }

    const questionsToCreate: Prisma.mock_questionsCreateManyInput[] = parsed.data.map((row: any) => {
        if (!row.question_text || !row.correct_answer) {
            throw new BadRequestException('CSV is missing required columns: question_text, correct_answer');
        }

        // Build options object from separate columns (option_a, option_b, etc.)
        let optionsObject: Record<string, string> = {};
        
        // Support both formats: legacy (options as JSON string) and new (separate columns)
        if (row.options) {
            // Legacy format: options as JSON string
            try {
                optionsObject = JSON.parse(row.options);
            } catch (e) {
                throw new BadRequestException(`Invalid JSON in options column for question: "${row.question_text}"`);
            }
        } else {
            // New format: separate columns for each option
            ['a', 'b', 'c', 'd', 'e', 'f'].forEach(key => {
                const columnName = `option_${key}`;
                if (row[columnName] && row[columnName].trim()) {
                    optionsObject[key] = row[columnName].trim();
                }
            });
            
            if (Object.keys(optionsObject).length === 0) {
                throw new BadRequestException(`No options found for question: "${row.question_text}". Please provide option_a, option_b, etc.`);
            }
        }

        return {
            question_text: row.question_text,
            correct_answer: row.correct_answer,
            options: optionsObject,
            marks: row.marks ? parseInt(row.marks, 10) : 1,
            question_type: row.question_type || 'mcq',
            test_id: testId,
        };
    });

    const result = await this.prisma.mock_questions.createMany({
        data: questionsToCreate,
    });

    return { message: `${result.count} questions created successfully.` };
}

  // ... rest of your service is correct
  create(createMockQuestionDto: CreateMockQuestionDto) {
    const { test_id, ...questionData } = createMockQuestionDto;
    return this.prisma.mock_questions.create({
      data: {
        ...questionData,
        mock_tests: {
          connect: { id: test_id },
        },
      },
    });
  }

  findAll() {
    return this.prisma.mock_questions.findMany({
      include: { mock_tests: true },
    });
  }

  async findOne(id: number) {
    const question = await this.prisma.mock_questions.findUnique({
      where: { id },
    });
    if (!question) {
      throw new NotFoundException(`Mock Question with ID ${id} not found`);
    }
    return question;
  }

  async update(id: number, updateMockQuestionDto: UpdateMockQuestionDto) {
    await this.findOne(id);
    return this.prisma.mock_questions.update({
      where: { id },
      data: updateMockQuestionDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.mock_questions.delete({ where: { id } });
  }
}