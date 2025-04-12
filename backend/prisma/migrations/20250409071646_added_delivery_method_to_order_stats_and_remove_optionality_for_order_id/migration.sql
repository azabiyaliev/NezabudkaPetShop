/*
  Warnings:

  - Made the column `orderId` on table `order_statistic` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "order_statistic" DROP CONSTRAINT "order_statistic_orderId_fkey";

-- AlterTable
ALTER TABLE "order_statistic" ADD COLUMN     "delivery_method" "DeliveryMethod" NOT NULL DEFAULT 'Delivery',
ALTER COLUMN "orderId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "order_statistic" ADD CONSTRAINT "order_statistic_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
