-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_product_id_fkey";

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "product_name" TEXT,
ADD COLUMN     "product_photo" TEXT,
ADD COLUMN     "product_price" INTEGER,
ADD COLUMN     "promo_price" INTEGER,
ADD COLUMN     "sale_percentage" INTEGER,
ADD COLUMN     "sales" BOOLEAN DEFAULT false,
ALTER COLUMN "product_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "total_price" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
