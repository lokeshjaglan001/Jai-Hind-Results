import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { slugify } from '../utils/slugify';
import { SupabaseService } from '../supabase/supabase.service';
import { CourseStatus, Prisma } from '@prisma/client';
import { ReorderTopicsDto } from './dto/reorder-topics.dto';
import { ReorderLessonsDto } from './dto/reorder-lessons.dto';
import { enrollment_status, CoursePricingModel, payment_status } from '../../generated/prisma';

// Helper function to convert HH:MM to seconds
const timeToSeconds = (time?: string | null): number | null => {
  if (!time || !/^\d{1,3}:\d{2}$/.test(time)) {
    // Allow more digits for hours
    return null; // Return null for invalid format
  }
  const parts = time.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes) || minutes > 59) {
    return null; // Return null for invalid values
  }
  return hours * 3600 + minutes * 60;
};

// Helper function to convert seconds to HH:MM
const secondsToTime = (seconds: number | null): string | null => {
  if (seconds === null || seconds === undefined || seconds < 0) {
    return null;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}`;
};

@Injectable()
export class CoursesService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService, // Inject SupabaseService
  ) {}

  // ======================================
  // Course CRUD Operations
  // ======================================

  async enrollFreeCourse(courseId: number, userId: number) {
    // 1. Fetch the course and ensure it exists and is free
    const course = await this.prisma.courses.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    if (course.pricing_model !== CoursePricingModel.free) {
      throw new BadRequestException(`Course with ID ${courseId} is not free.`);
    }

    // 2. Check if the user is already enrolled
    const existingEnrollment = await this.prisma.enrollments.findFirst({
      where: {
        user_id: userId,
        course_id: courseId,
      },
    });

    if (existingEnrollment) {
      // You could return the existing enrollment or throw an error
      // Throwing an error might be clearer if the button should be disabled
      throw new ConflictException('User is already enrolled in this course.');
      // Alternatively: return existingEnrollment;
    }

    // 3. Create the enrollment record
    const newEnrollment = await this.prisma.enrollments.create({
      data: {
        user_id: userId,
        course_id: courseId,
        status: enrollment_status.active, // Set status to active for free courses
        started_at: new Date(),
      },
    });

    return {
      success: true,
      message: 'Successfully enrolled in the free course.',
      enrollment: newEnrollment, // Optionally return the enrollment record
    };
  }

  async checkEnrollment(courseId: number, userId: number): Promise<{ enrolled: boolean }> {
    // 1. Fetch the course to check its pricing model
    const course = await this.prisma.courses.findUnique({
      where: { id: courseId },
      select: { pricing_model: true }, // Only need the pricing model
    });

    if (!course) {
      // Throw NotFoundException if course doesn't exist
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // 2. Check based on pricing model
    let isEnrolled = false;
    if (course.pricing_model === CoursePricingModel.free) {
      // For FREE courses, check the enrollments table
      const enrollment = await this.prisma.enrollments.findFirst({
        where: {
          user_id: userId,
          course_id: courseId,
          status: enrollment_status.active,
        },
      });
      isEnrolled = !!enrollment;
    } else {
      // For PAID courses, check the payments table
      const payment = await this.prisma.payments.findFirst({
        where: {
          user_id: userId,
          course_id: courseId,
          status: payment_status.success, // Look for a successful payment
        },
      });
      isEnrolled = !!payment;
    }

    // 3. Return the result
    return { enrolled: isEnrolled };
  }

  async findUserEnrollments(userId: number) {
    // Fetch all active enrollments for the user (free courses)
    const enrollments = await this.prisma.enrollments.findMany({
      where: {
        user_id: userId,
        status: enrollment_status.active,
      },
      include: {
        courses: {
          include: {
            category: true,
            course_topics: {
              orderBy: { order: 'asc' },
              include: {
                lessons: {
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
      },
      orderBy: { started_at: 'desc' },
    });

    // Fetch paid courses from successful payments
    const paidCourses = await this.prisma.payments.findMany({
      where: {
        user_id: userId,
        status: payment_status.success,
        course_id: { not: null },
      },
      include: {
        courses: {
          include: {
            category: true,
            course_topics: {
              orderBy: { order: 'asc' },
              include: {
                lessons: {
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
      distinct: ['course_id'], // Avoid duplicates if multiple payments for same course
    });

    // Combine and format the results
    const allEnrollments = [
      ...enrollments,
      ...paidCourses.map(payment => ({
        id: payment.id,
        user_id: payment.user_id,
        course_id: payment.course_id,
        status: 'active' as const,
        started_at: payment.created_at,
        courses: payment.courses,
      })),
    ];

    return allEnrollments;
  }

  async createCourse(createCourseDto: CreateCourseDto) {
    const {
      tagIds,
      authorIds,
      category_id,
      title,
      total_duration_hhmm,
      regular_price,
      sale_price,
      ...courseData
    } = createCourseDto;

    // Validate prices
    if (
      sale_price !== null &&
      sale_price !== undefined &&
      regular_price !== null &&
      regular_price !== undefined &&
      sale_price >= regular_price
    ) {
      throw new BadRequestException('Sale price must be less than regular price.');
    }

    // Validate tags exist if provided
    if (tagIds && tagIds.length > 0) {
      const existingTags = await this.prisma.course_tags.findMany({
        where: {
          id: { in: tagIds }
        }
      });
      
      if (existingTags.length !== tagIds.length) {
        const foundTagIds = existingTags.map(t => Number(t.id));
        const missingTagIds = tagIds.filter(id => !foundTagIds.includes(id));
        throw new BadRequestException(`Tag(s) with ID(s) ${missingTagIds.join(', ')} not found`);
      }
    }

    const slug = slugify(createCourseDto.title);
    const total_duration_sec = timeToSeconds(total_duration_hhmm);

    return this.prisma.courses.create({
      data: {
        ...courseData,
        title,
        slug,
        total_duration_sec,
        regular_price: regular_price ?? null, // Ensure null if undefined
        sale_price: sale_price ?? null,       // Ensure null if undefined
        category: {
          connect: { id: category_id },
        },
        // Connect authors (many-to-many)
        course_authors: {
          create: authorIds.map((userId) => ({
            user: { connect: { id: userId } },
          })),
        },
        // Connect tags (many-to-many)
        course_course_tags: tagIds
          ? {
              create: tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        course_authors: { include: { user: true } },
        course_course_tags: { include: { tag: true } },
      },
    });
  }

  async findAllCourses(status?: CourseStatus) {
    
    const courses = await this.prisma.courses.findMany({
      where: {
        status: status ?? undefined, // Default to published if no status provided
      },
      include: {
        category: true,
        course_authors: { select: { user: { select: { id: true, full_name: true } } } }, // Only necessary author info
        course_course_tags: { select: { tag: true } }, // Only necessary tag info
        course_topics: {
          orderBy: { order: 'asc' }, // Order topics
          include: {
            lessons: {
              orderBy: { order: 'asc' }, // Order lessons within topics
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    // Format duration and map authors/tags for cleaner output
    return courses.map(course => ({
        ...course,
        total_duration_hhmm: secondsToTime(course.total_duration_sec),
        authors: course.course_authors.map(ca => ca.user),
        tags: course.course_course_tags.map(ct => ct.tag),
    }));
  }

  async findCourseByIdOrSlug(identifier: number | string) {
     const isSlug = isNaN(Number(identifier));
     const whereClause = isSlug ? { slug: String(identifier) } : { id: Number(identifier) };

     const course = await this.prisma.courses.findUnique({
       where: whereClause,
       include: {
         category: true,
         course_authors: { include: { user: true } },
         course_course_tags: { include: { tag: true } },
         course_topics: {
           orderBy: { order: 'asc' },
           include: {
             lessons: {
               orderBy: { order: 'asc' },
             },
           },
         },
       },
     });

     if (!course) {
       throw new NotFoundException(`Course with ${isSlug ? 'slug' : 'ID'} "${identifier}" not found`);
     }

     // Add formatted duration and potentially calculate lesson count
     const lesson_count = course.course_topics.reduce((sum, topic) => sum + topic.lessons.length, 0);

     return {
        ...course,
        total_duration_hhmm: secondsToTime(course.total_duration_sec),
        authors: course.course_authors.map(ca => ca.user),
        tags: course.course_course_tags.map(ct => ct.tag),
        lesson_count
     };
  }

  async updateCourse(id: number, updateCourseDto: UpdateCourseDto) {
    const {
      tagIds,
      authorIds,
      category_id,
      title,
      total_duration_hhmm,
      regular_price,
      sale_price,
      ...courseData
    } = updateCourseDto;

    const existingCourse = await this.findCourseByIdOrSlug(id); // Ensures course exists

    // Validate prices on update
     const finalRegularPrice = regular_price !== undefined ? regular_price : existingCourse.regular_price;
     const finalSalePrice = sale_price !== undefined ? sale_price : existingCourse.sale_price;

    if (
        finalSalePrice !== null &&
        finalRegularPrice !== null &&
        finalSalePrice >= finalRegularPrice
    ) {
       throw new BadRequestException('Sale price must be less than regular price.');
    }

    const data: Prisma.coursesUpdateInput = { ...courseData };
    if (updateCourseDto.title) {
      data.slug = slugify(updateCourseDto.title);
      data.title = updateCourseDto.title; // Also make sure to update the title itself
    }

    if (total_duration_hhmm) {
      data.total_duration_sec = timeToSeconds(total_duration_hhmm);
    }
     if (regular_price !== undefined) data.regular_price = regular_price;
     if (sale_price !== undefined) data.sale_price = sale_price;


    if (category_id) {
      data.category = { connect: { id: category_id } };
    }

    return this.prisma.$transaction(async (tx) => {
      // Handle Authors (replace existing)
      if (authorIds) {
        await tx.course_authors.deleteMany({ where: { course_id: id } });
        data.course_authors = {
          create: authorIds.map((userId) => ({
            user: { connect: { id: userId } },
          })),
        };
      }

      // Handle Tags (replace existing)
      if (tagIds && tagIds.length > 0) {
        // First, verify all tags exist
        const existingTags = await tx.course_tags.findMany({
          where: {
            id: { in: tagIds }
          }
        });
        
        if (existingTags.length !== tagIds.length) {
          const foundTagIds = existingTags.map(t => Number(t.id));
          const missingTagIds = tagIds.filter(id => !foundTagIds.includes(id));
          throw new BadRequestException(`Tag(s) with ID(s) ${missingTagIds.join(', ')} not found`);
        }

        await tx.course_course_tags.deleteMany({ where: { course_id: id } });
        data.course_course_tags = {
          create: tagIds.map((tagId) => ({
            tag: { connect: { id: tagId } },
          })),
        };
      }

      const updatedCourse = await tx.courses.update({
        where: { id },
        data,
        include: {
          category: true,
          course_authors: { include: { user: true } },
          course_course_tags: { include: { tag: true } },
          course_topics: { include: { lessons: true } }, // Include topics/lessons if needed in response
        },
      });

        // Map authors/tags for cleaner output after update
        return {
            ...updatedCourse,
            total_duration_hhmm: secondsToTime(updatedCourse.total_duration_sec),
            authors: updatedCourse.course_authors.map(ca => ca.user),
            tags: updatedCourse.course_course_tags.map(ct => ct.tag),
        };
    });
  }

  async deleteCourse(id: number) {
    await this.findCourseByIdOrSlug(id); // Ensures course exists
    // Relations with onDelete: Cascade (topics, lessons, authors, tags) will be handled automatically
    // Relations with onDelete: SetNull (category, payments, enrollments) will be handled automatically
    return this.prisma.courses.delete({ where: { id } });
  }

  // ======================================
  // Topic CRUD Operations (within a Course)
  // ======================================

  async createTopic(courseId: number, createTopicDto: CreateTopicDto) {
    await this.findCourseByIdOrSlug(courseId); // Ensure course exists

    // --- START ORDER LOGIC ---
    // Find the current highest order number for topics in this course
    const lastTopic = await this.prisma.course_topics.findFirst({
      where: { course_id: courseId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const nextOrder = lastTopic ? lastTopic.order + 1 : 0; // Start at 0 if no topics exist
    // --- END ORDER LOGIC ---

    return this.prisma.course_topics.create({
      data: {
        title: createTopicDto.title, // Use fields from DTO
        description: createTopicDto.description, // Use fields from DTO
        order: nextOrder, // Use calculated order
        course: { connect: { id: courseId } },
      },
    });
  }

  async findTopicsByCourse(courseId: number) {
    await this.findCourseByIdOrSlug(courseId); // Ensure course exists
    return this.prisma.course_topics.findMany({
      where: { course_id: courseId },
      orderBy: { order: 'asc' },
      include: { lessons: { orderBy: { order: 'asc' } } }, // Include lessons ordered
    });
  }

  async findTopicById(topicId: number) {
    const topic = await this.prisma.course_topics.findUnique({
        where: { id: topicId },
        include: { lessons: { orderBy: { order: 'asc' } } }
    });
    if (!topic) {
        throw new NotFoundException(`Topic with ID ${topicId} not found`);
    }
    return topic;
  }

  async updateTopic(topicId: number, updateTopicDto: UpdateTopicDto) {
    await this.findTopicById(topicId); // Ensure topic exists
    return this.prisma.course_topics.update({
      where: { id: topicId },
      data: updateTopicDto,
    });
  }

  async deleteTopic(topicId: number) {
    await this.findTopicById(topicId); // Ensure topic exists
    // Lessons associated will be cascade deleted by the database relation
    return this.prisma.course_topics.delete({ where: { id: topicId } });
  }

  // Add logic for reordering topics if needed (more complex, involves shifting orders)

  // ======================================
  // Lesson CRUD Operations (within a Topic)
  // ======================================

  async createLesson(topicId: number, createLessonDto: CreateLessonDto) {
    await this.findTopicById(topicId); // Ensure topic exists

    // --- START ORDER LOGIC ---
    // Find the current highest order number for lessons in this topic
    const lastLesson = await this.prisma.course_lessons.findFirst({
      where: { topic_id: topicId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const nextOrder = lastLesson ? lastLesson.order + 1 : 0; // Start at 0 if no lessons exist
    // --- END ORDER LOGIC ---

    return this.prisma.course_lessons.create({
      data: {
        title: createLessonDto.title, // Use fields from DTO
        description: createLessonDto.description, // Use fields from DTO
        video_url: createLessonDto.video_url, // Use fields from DTO
        video_duration_sec: createLessonDto.video_duration_sec, // Use fields from DTO
        featured_image_url: createLessonDto.featured_image_url, // Will be added by controller
        order: nextOrder, // Use calculated order
        topic: { connect: { id: topicId } },
      },
    });
  }

  async findLessonById(lessonId: number) {
     const lesson = await this.prisma.course_lessons.findUnique({
       where: { id: lessonId },
     });
     if (!lesson) {
       throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
     }
     return lesson;
  }

  async updateLesson(lessonId: number, updateLessonDto: UpdateLessonDto) {
    await this.findLessonById(lessonId); // Ensure lesson exists
    return this.prisma.course_lessons.update({
      where: { id: lessonId },
      data: updateLessonDto,
    });
  }

  async deleteLesson(lessonId: number) {
    await this.findLessonById(lessonId); // Ensure lesson exists
    return this.prisma.course_lessons.delete({ where: { id: lessonId } });
  }

  async reorderTopics(courseId: number, dto: ReorderTopicsDto) {
    await this.findCourseByIdOrSlug(courseId); // Ensure course exists

    const { orderedTopicIds } = dto;

    // Verify all provided topic IDs actually belong to this course
    const topicsInCourse = await this.prisma.course_topics.findMany({
      where: { course_id: courseId },
      select: { id: true },
    });
    const topicIdsSet = new Set(topicsInCourse.map(t => Number(t.id)));
    if (orderedTopicIds.some(id => !topicIdsSet.has(id))) {
      throw new BadRequestException('One or more topic IDs do not belong to this course.');
    }
    if (orderedTopicIds.length !== topicIdsSet.size) {
        throw new BadRequestException('The number of provided topic IDs does not match the number of topics in the course.');
    }


    // Perform updates within a transaction
    return this.prisma.$transaction(
      orderedTopicIds.map((topicId, index) =>
        this.prisma.course_topics.update({
          where: { id: topicId },
          data: { order: index }, // Set order based on array index
        }),
      ),
    );
  }
  // --- END REORDER TOPICS METHOD ---

  // --- ADD REORDER LESSONS METHOD ---
  async reorderLessons(topicId: number, dto: ReorderLessonsDto) {
    await this.findTopicById(topicId); // Ensure topic exists

    const { orderedLessonIds } = dto;

    // Verify all provided lesson IDs actually belong to this topic
    const lessonsInTopic = await this.prisma.course_lessons.findMany({
        where: { topic_id: topicId },
        select: { id: true }
    });
    const lessonIdsSet = new Set(lessonsInTopic.map(l => Number(l.id)));
    if (orderedLessonIds.some(id => !lessonIdsSet.has(id))) {
        throw new BadRequestException('One or more lesson IDs do not belong to this topic.');
    }
    if (orderedLessonIds.length !== lessonIdsSet.size) {
        throw new BadRequestException('The number of provided lesson IDs does not match the number of lessons in the topic.');
    }

    // Perform updates within a transaction
    return this.prisma.$transaction(
      orderedLessonIds.map((lessonId, index) =>
        this.prisma.course_lessons.update({
          where: { id: lessonId },
          data: { order: index }, // Set order based on array index
        }),
      ),
    );
  }

}