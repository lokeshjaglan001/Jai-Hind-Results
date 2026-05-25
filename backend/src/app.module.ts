import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagsModule } from './tags/tags.module';
import { PostTemplatesModule } from './post-templates/post-templates.module';
import { MockCategoriesModule } from './mock-categories/mock-categories.module';
import { MockTagsModule } from './mock-tags/mock-tags.module';
import { MockSeriesModule } from './mock-series/mock-series.module';
import { MockTestsModule } from './mock-tests/mock-tests.module';
import { MockQuestionsModule } from './mock-questions/mock-questions.module';
import { PaymentsModule } from './payments/payments.module';
import { DeploymentModule } from './deployment/deployment.module';
import { SupabaseModule } from './supabase/supabase.module';
import { FilesModule } from './files/files.module';
import { FormsModule } from './forms/forms.module';
import { CarouselModule } from './carousel/carousel.module';
import { CourseCategoriesModule } from './course-categories/course-categories.module';
import { CourseTagsModule } from './course-tags/course-tags.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CarouselModule,
    SupabaseModule,
    AuthModule,
    CoursesModule,
    PostsModule,
    CategoriesModule,
    TagsModule,
    PostTemplatesModule,
    MockCategoriesModule,
    MockTagsModule,
    MockSeriesModule,
    MockTestsModule,
    MockQuestionsModule,
    PaymentsModule,
    DeploymentModule,
    FilesModule,
    FormsModule,
    CourseCategoriesModule,
    CourseTagsModule,
    CoursesModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}