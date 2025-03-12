-- CreateTable
CREATE TABLE "editionSite" (
    "id" SERIAL NOT NULL,
    "instagram" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "logo" TEXT NOT NULL,

    CONSTRAINT "editionSite_pkey" PRIMARY KEY ("id")
);
