/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `brands` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "brands_title_key" ON "brands"("title");
