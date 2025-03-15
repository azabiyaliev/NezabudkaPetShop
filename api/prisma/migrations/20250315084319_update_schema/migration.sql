/*
  Warnings:

  - You are about to drop the column `productId` on the `comments` table. All the data in the column will be lost.
  - Added the required column `reviewId` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_productId_fkey";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "productId",
ADD COLUMN     "reviewId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "text" TEXT;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
