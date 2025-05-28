/*
  Warnings:

  - A unique constraint covering the columns `[imageHash]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageHash` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "imageHash" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Product_imageHash_key" ON "Product"("imageHash");
