/*
  Warnings:

  - You are about to drop the column `anonymous_cart_id` on the `carts` table. All the data in the column will be lost.
  - Made the column `user_id` on table `carts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_user_id_fkey";

-- DropIndex
DROP INDEX "carts_anonymous_cart_id_key";

-- AlterTable
ALTER TABLE "carts" DROP COLUMN "anonymous_cart_id",
ALTER COLUMN "user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
