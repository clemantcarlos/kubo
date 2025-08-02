/*
  Warnings:

  - You are about to drop the column `unit` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the `ProductStorageUnit` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `unitId` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_storageUnitId_fkey";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "unit",
ADD COLUMN     "unitId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RecipeIngredient" DROP COLUMN "unit",
ADD COLUMN     "unitId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ProductStorageUnit";

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_storageUnitId_fkey" FOREIGN KEY ("storageUnitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
