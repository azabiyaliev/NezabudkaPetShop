-- CreateTable
CREATE TABLE "deliveryPage" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "map" TEXT NOT NULL,

    CONSTRAINT "deliveryPage_pkey" PRIMARY KEY ("id")
);
