/*
  Warnings:

  - Added the required column `mapGoogleLink` to the `editionSite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "editionSite" ADD COLUMN     "mapGoogleLink" TEXT NOT NULL;
