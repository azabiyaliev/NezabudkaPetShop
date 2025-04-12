/*
  Warnings:

  - You are about to drop the column `deliveryMethod` on the `order_statistic` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order_statistic" DROP COLUMN "deliveryMethod",
ADD COLUMN     "orderId" INTEGER;

-- AddForeignKey
ALTER TABLE "order_statistic" ADD CONSTRAINT "order_statistic_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
