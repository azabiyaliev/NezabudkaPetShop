/*
  Warnings:

  - You are about to drop the column `originalPrice` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "originalPrice",
ADD COLUMN     "promo_price" INTEGER;
