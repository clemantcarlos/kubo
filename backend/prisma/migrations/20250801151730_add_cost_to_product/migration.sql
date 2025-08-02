/*
  Warnings:

  - You are about to drop the `UserIdentityDocumentType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cost` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_identityDocumentTypeId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "cost" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "UserIdentityDocumentType";

-- CreateTable
CREATE TABLE "IdentityDocumentType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdentityDocumentType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IdentityDocumentType_name_key" ON "IdentityDocumentType"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_identityDocumentTypeId_fkey" FOREIGN KEY ("identityDocumentTypeId") REFERENCES "IdentityDocumentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
