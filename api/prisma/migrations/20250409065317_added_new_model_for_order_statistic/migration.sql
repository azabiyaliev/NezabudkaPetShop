/*
  Warnings:

  - You are about to drop the column `deliveryMethod` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `delivery_stats` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `pickup_stats` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "deliveryMethod",
DROP COLUMN "delivery_stats",
DROP COLUMN "paymentMethod",
DROP COLUMN "pickup_stats",
ADD COLUMN     "delivery_method" "DeliveryMethod" NOT NULL DEFAULT 'Delivery',
ADD COLUMN     "payment_method" "PaymentMethod" NOT NULL DEFAULT 'ByCash';

-- CreateTable
CREATE TABLE "order_statistic" (
    "id" SERIAL NOT NULL,
    "deliveryMethod" "DeliveryMethod" NOT NULL DEFAULT 'Delivery',
    "pickup_stats" INTEGER,
    "delivery_stats" INTEGER,

    CONSTRAINT "order_statistic_pkey" PRIMARY KEY ("id")
);
