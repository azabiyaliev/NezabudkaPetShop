/*
  Warnings:

  - Added the required column `delivery_stats` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickup_stats` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ordered_products_stats` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('PickUp', 'Delivery');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "deliveryMethod" "DeliveryMethod" NOT NULL DEFAULT 'Delivery',
ADD COLUMN     "delivery_stats" INTEGER NOT NULL,
ADD COLUMN     "pickup_stats" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "ordered_products_stats" INTEGER NOT NULL;
