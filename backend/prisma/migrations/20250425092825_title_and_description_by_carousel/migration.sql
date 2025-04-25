/*
  Warnings:

  - Added the required column `description` to the `photo_by_carousel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `photo_by_carousel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "photo_by_carousel" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
