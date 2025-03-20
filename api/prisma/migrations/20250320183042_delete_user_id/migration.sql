/*
  Warnings:

  - You are about to drop the column `user_id` on the `cards` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cards" DROP CONSTRAINT "cards_user_id_fkey";

-- AlterTable
ALTER TABLE "cards" DROP COLUMN "user_id";
