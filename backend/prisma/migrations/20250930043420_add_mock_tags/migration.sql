-- CreateEnum
CREATE TYPE "public"."enrollment_status" AS ENUM ('active', 'expired', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."payment_status" AS ENUM ('pending', 'success', 'failed');

-- CreateEnum
CREATE TYPE "public"."plan_type" AS ENUM ('free', 'one_time', 'subscription');

-- CreateEnum
CREATE TYPE "public"."question_type" AS ENUM ('mcq', 'true_false', 'fill_blank');

-- CreateEnum
CREATE TYPE "public"."user_role" AS ENUM ('admin', 'student');

-- CreateTable
CREATE TABLE "public"."answer_keys" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER,
    "file_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answer_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" BIGSERIAL NOT NULL,
    "post_id" BIGINT,
    "user_id" BIGINT,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."course_plans" (
    "id" BIGSERIAL NOT NULL,
    "course_id" BIGINT,
    "plan_type" "public"."plan_type" NOT NULL,
    "plan_name" TEXT NOT NULL,
    "price" DECIMAL(10,2) DEFAULT 0,
    "duration_days" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."course_reviews" (
    "id" BIGSERIAL NOT NULL,
    "course_id" BIGINT,
    "user_id" BIGINT,
    "rating" INTEGER,
    "review" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."course_videos" (
    "id" BIGSERIAL NOT NULL,
    "course_id" BIGINT,
    "title" TEXT NOT NULL,
    "video_url" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "is_demo" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."courses" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail_url" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."enrollments" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT,
    "course_id" BIGINT,
    "plan_id" BIGINT,
    "status" "public"."enrollment_status" DEFAULT 'active',
    "started_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(6),

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."google_ads" (
    "id" BIGSERIAL NOT NULL,
    "placement" TEXT NOT NULL,
    "ad_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "google_ads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mock_attempts" (
    "id" BIGSERIAL NOT NULL,
    "test_id" BIGINT,
    "user_id" BIGINT,
    "answers" JSONB NOT NULL,
    "score" INTEGER,
    "started_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(6),

    CONSTRAINT "mock_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mock_categories" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "mock_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mock_tags" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "mock_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mock_series_tags" (
    "series_id" BIGINT NOT NULL,
    "tag_id" BIGINT NOT NULL,

    CONSTRAINT "mock_series_tags_pkey" PRIMARY KEY ("series_id","tag_id")
);

-- CreateTable
CREATE TABLE "public"."mock_questions" (
    "id" BIGSERIAL NOT NULL,
    "test_id" BIGINT,
    "question_text" TEXT NOT NULL,
    "question_type" "public"."question_type" DEFAULT 'mcq',
    "options" JSONB,
    "correct_answer" TEXT NOT NULL,
    "marks" INTEGER DEFAULT 1,

    CONSTRAINT "mock_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mock_series" (
    "id" BIGSERIAL NOT NULL,
    "category_id" BIGINT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "price" DECIMAL,

    CONSTRAINT "mock_series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mock_tests" (
    "id" BIGSERIAL NOT NULL,
    "series_id" BIGINT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "duration_minutes" INTEGER NOT NULL,
    "total_marks" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "is_free" BOOLEAN,

    CONSTRAINT "mock_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT,
    "course_id" BIGINT,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_method" TEXT NOT NULL,
    "status" "public"."payment_status" DEFAULT 'pending',
    "transaction_id" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "mock_series_id" BIGINT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."post_tags" (
    "post_id" BIGINT NOT NULL,
    "tag_id" BIGINT NOT NULL,

    CONSTRAINT "post_tags_pkey" PRIMARY KEY ("post_id","tag_id")
);

-- CreateTable
CREATE TABLE "public"."post_templates" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "structure" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."posts" (
    "id" BIGSERIAL NOT NULL,
    "category_id" BIGINT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "external_url" TEXT,
    "thumbnail_url" TEXT,
    "published_at" TIMESTAMP(6),
    "created_by" BIGINT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "template_id" BIGINT,
    "content_json" JSONB,
    "content_html" TEXT,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."study_materials" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "file_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "study_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tags" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" BIGSERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "public"."user_role" DEFAULT 'student',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "public"."categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "mock_categories_name_key" ON "public"."mock_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "mock_tags_name_key" ON "public"."mock_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "post_templates_name_key" ON "public"."post_templates"("name");

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "public"."posts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "public"."tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."course_plans" ADD CONSTRAINT "course_plans_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."course_reviews" ADD CONSTRAINT "course_reviews_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."course_reviews" ADD CONSTRAINT "course_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."course_videos" ADD CONSTRAINT "course_videos_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."enrollments" ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."enrollments" ADD CONSTRAINT "enrollments_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."course_plans"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."enrollments" ADD CONSTRAINT "enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mock_attempts" ADD CONSTRAINT "mock_attempts_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "public"."mock_tests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mock_attempts" ADD CONSTRAINT "mock_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mock_series_tags" ADD CONSTRAINT "mock_series_tags_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "public"."mock_series"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mock_series_tags" ADD CONSTRAINT "mock_series_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."mock_tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mock_questions" ADD CONSTRAINT "mock_questions_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "public"."mock_tests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mock_series" ADD CONSTRAINT "mock_series_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."mock_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mock_tests" ADD CONSTRAINT "mock_tests_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "public"."mock_series"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_mock_series_id_fkey" FOREIGN KEY ("mock_series_id") REFERENCES "public"."mock_series"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."post_tags" ADD CONSTRAINT "post_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."post_tags" ADD CONSTRAINT "post_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."post_templates"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
