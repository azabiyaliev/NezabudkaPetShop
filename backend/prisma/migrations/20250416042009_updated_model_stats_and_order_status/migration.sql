/*
  Warnings:

  - The values [inProcess,onTheWay,isDelivered] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `date` to the `order_statistic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Returned', 'Canceled');
ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;

-- AlterTable
ALTER TABLE "order_statistic" ADD COLUMN     "bonus_usage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "canceled_order_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "payment_by_card" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "payment_by_cash" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalOrders" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "pickup_stats" SET DEFAULT 0,
ALTER COLUMN "delivery_stats" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'Pending';
