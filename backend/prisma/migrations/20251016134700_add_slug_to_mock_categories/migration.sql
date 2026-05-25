/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `mock_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "mock_categories" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "mock_categories_slug_key" ON "mock_categories"("slug");
