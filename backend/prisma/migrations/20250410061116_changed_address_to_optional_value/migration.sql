/*
  Warnings:

  - Made the column `ordered_products_stats` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "address" DROP NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "ordered_products_stats" SET NOT NULL;
