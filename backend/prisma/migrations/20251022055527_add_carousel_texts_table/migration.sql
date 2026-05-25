/*
  Warnings:

  - You are about to drop the column `content_json` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "content_json";

-- CreateTable
CREATE TABLE "carousel_texts" (
    "id" BIGSERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carousel_texts_pkey" PRIMARY KEY ("id")
);
