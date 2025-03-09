/*
  Warnings:

  - A unique constraint covering the columns `[googleID]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facebookID]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "facebookID" TEXT,
ADD COLUMN     "googleID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_googleID_key" ON "users"("googleID");

-- CreateIndex
CREATE UNIQUE INDEX "users_facebookID_key" ON "users"("facebookID");
