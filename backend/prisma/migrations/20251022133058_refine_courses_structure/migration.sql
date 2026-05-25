/*
  Warnings:

  - You are about to drop the column `expires_at` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `plan_id` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the `answer_keys` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course_plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course_reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course_videos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `google_ads` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `study_materials` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Made the column `slug` on table `mock_categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `mock_series` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `mock_tests` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CoursePricingModel" AS ENUM ('free', 'paid');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('draft', 'published');

-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."course_plans" DROP CONSTRAINT "course_plans_course_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."course_reviews" DROP CONSTRAINT "course_reviews_course_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."course_reviews" DROP CONSTRAINT "course_reviews_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."course_videos" DROP CONSTRAINT "course_videos_course_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."enrollments" DROP CONSTRAINT "enrollments_plan_id_fkey";

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "category_id" BIGINT,
ADD COLUMN     "intro_video_url" TEXT,
ADD COLUMN     "pricing_model" "CoursePricingModel" NOT NULL DEFAULT 'free',
ADD COLUMN     "regular_price" DECIMAL(10,2),
ADD COLUMN     "sale_price" DECIMAL(10,2),
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "status" "CourseStatus" NOT NULL DEFAULT 'draft',
ADD COLUMN     "total_duration_sec" INTEGER,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "expires_at",
DROP COLUMN "plan_id";

-- AlterTable
ALTER TABLE "mock_categories" ALTER COLUMN "slug" SET NOT NULL;

-- AlterTable
ALTER TABLE "mock_series" ALTER COLUMN "slug" SET NOT NULL;

-- AlterTable
ALTER TABLE "mock_tests" ALTER COLUMN "slug" SET NOT NULL;

-- DropTable
DROP TABLE "public"."answer_keys";

-- DropTable
DROP TABLE "public"."comments";

-- DropTable
DROP TABLE "public"."course_plans";

-- DropTable
DROP TABLE "public"."course_reviews";

-- DropTable
DROP TABLE "public"."course_videos";

-- DropTable
DROP TABLE "public"."google_ads";

-- DropTable
DROP TABLE "public"."study_materials";

-- CreateTable
CREATE TABLE "course_categories" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_tags" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_course_tags" (
    "course_id" BIGINT NOT NULL,
    "tag_id" BIGINT NOT NULL,

    CONSTRAINT "course_course_tags_pkey" PRIMARY KEY ("course_id","tag_id")
);

-- CreateTable
CREATE TABLE "course_authors" (
    "course_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "course_authors_pkey" PRIMARY KEY ("course_id","user_id")
);

-- CreateTable
CREATE TABLE "course_topics" (
    "id" BIGSERIAL NOT NULL,
    "course_id" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "course_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_lessons" (
    "id" BIGSERIAL NOT NULL,
    "topic_id" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "featured_image_url" TEXT,
    "video_url" TEXT NOT NULL,
    "video_duration_sec" INTEGER,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "course_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_categories_name_key" ON "course_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "course_categories_slug_key" ON "course_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "course_tags_name_key" ON "course_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "course_tags_slug_key" ON "course_tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "payments_user_id_course_id_idx" ON "payments"("user_id", "course_id");

-- AddForeignKey
ALTER TABLE "course_course_tags" ADD CONSTRAINT "course_course_tags_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_course_tags" ADD CONSTRAINT "course_course_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "course_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_authors" ADD CONSTRAINT "course_authors_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_authors" ADD CONSTRAINT "course_authors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "course_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_topics" ADD CONSTRAINT "course_topics_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_lessons" ADD CONSTRAINT "course_lessons_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "course_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
