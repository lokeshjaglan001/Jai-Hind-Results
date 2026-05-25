/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `mock_tests` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "mock_tests" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "mock_tests_slug_key" ON "mock_tests"("slug");
