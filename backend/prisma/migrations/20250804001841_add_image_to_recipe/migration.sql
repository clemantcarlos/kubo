/*
  Warnings:

  - You are about to drop the column `productionId` on the `InventoryMovement` table. All the data in the column will be lost.
  - You are about to drop the column `recipeId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Production` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[imageHash]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "InventoryMovement" DROP CONSTRAINT "InventoryMovement_productionId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Production" DROP CONSTRAINT "Production_productId_fkey";

-- DropForeignKey
ALTER TABLE "Production" DROP CONSTRAINT "Production_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Production" DROP CONSTRAINT "Production_userId_fkey";

-- AlterTable
ALTER TABLE "InventoryMovement" DROP COLUMN "productionId";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "recipeId";

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "imageHash" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- DropTable
DROP TABLE "Production";

-- DropTable
DROP TABLE "Task";

-- DropEnum
DROP TYPE "ProductionStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_imageHash_key" ON "Recipe"("imageHash");
