/*
  Warnings:

  - You are about to drop the column `storageUnitId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `unitId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_storageUnitId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "storageUnitId",
ADD COLUMN     "unitId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
