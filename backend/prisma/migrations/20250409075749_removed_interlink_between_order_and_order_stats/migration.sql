/*
  Warnings:

  - You are about to drop the column `delivery_method` on the `order_statistic` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `order_statistic` table. All the data in the column will be lost.
  - Made the column `pickup_stats` on table `order_statistic` required. This step will fail if there are existing NULL values in that column.
  - Made the column `delivery_stats` on table `order_statistic` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "order_statistic" DROP CONSTRAINT "order_statistic_orderId_fkey";

-- AlterTable
ALTER TABLE "order_statistic" DROP COLUMN "delivery_method",
DROP COLUMN "orderId",
ALTER COLUMN "pickup_stats" SET NOT NULL,
ALTER COLUMN "delivery_stats" SET NOT NULL;
