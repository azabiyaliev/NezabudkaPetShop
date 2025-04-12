-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "delivery_stats" DROP NOT NULL,
ALTER COLUMN "pickup_stats" DROP NOT NULL;
