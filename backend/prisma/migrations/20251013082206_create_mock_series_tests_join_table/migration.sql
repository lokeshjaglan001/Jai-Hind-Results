/*
  Warnings:

  - You are about to drop the column `series_id` on the `mock_tests` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."mock_tests" DROP CONSTRAINT "mock_tests_series_id_fkey";

-- AlterTable
ALTER TABLE "public"."mock_tests" DROP COLUMN "series_id";

-- CreateTable
CREATE TABLE "public"."mock_series_tests" (
    "series_id" BIGINT NOT NULL,
    "test_id" BIGINT NOT NULL,

    CONSTRAINT "mock_series_tests_pkey" PRIMARY KEY ("series_id","test_id")
);

-- AddForeignKey
ALTER TABLE "public"."mock_series_tests" ADD CONSTRAINT "mock_series_tests_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "public"."mock_series"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mock_series_tests" ADD CONSTRAINT "mock_series_tests_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "public"."mock_tests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
