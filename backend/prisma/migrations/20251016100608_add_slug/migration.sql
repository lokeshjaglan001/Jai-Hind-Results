/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `mock_series` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `mock_series_tests` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "mock_series" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "mock_series_tests" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "mock_series_slug_key" ON "mock_series"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "mock_series_tests_slug_key" ON "mock_series_tests"("slug");
