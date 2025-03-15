-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('inProcess', 'onTheWay', 'isDelivered', 'Canceled');

-- CreateTable
CREATE TABLE "Products" (
    "id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_photo" TEXT NOT NULL,
    "product_price" INTEGER NOT NULL,
    "brand" TEXT,
    "product_description" TEXT NOT NULL,
    "product_comment" TEXT,
    "existence" BOOLEAN NOT NULL DEFAULT true,
    "sales" BOOLEAN NOT NULL DEFAULT false,
    "purchasedProductCounter" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "quantity" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'inProcess',
    "isDelivered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Products_brand_key" ON "Products"("brand");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
