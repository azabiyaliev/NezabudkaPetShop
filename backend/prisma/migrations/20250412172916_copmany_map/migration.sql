/*
  Warnings:

  - You are about to drop the `CompanyPages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "CompanyPages";

-- CreateTable
CREATE TABLE "companyPages" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "companyPages_pkey" PRIMARY KEY ("id")
);
