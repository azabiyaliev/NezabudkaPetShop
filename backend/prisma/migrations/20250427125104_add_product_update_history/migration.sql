-- CreateTable
CREATE TABLE "product_update_history" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "fieldName" TEXT NOT NULL,
    "oldValue" TEXT NOT NULL,
    "newValue" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_update_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_update_history" ADD CONSTRAINT "product_update_history_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
