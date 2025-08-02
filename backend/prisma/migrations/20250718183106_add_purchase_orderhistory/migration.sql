/*
  Warnings:

  - You are about to drop the column `approvedAt` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the column `approvedBy` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the column `cancellationReason` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the column `cancelledAt` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the column `cancelledBy` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the `Purchase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchaseItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_userId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseItem" DROP CONSTRAINT "PurchaseItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseItem" DROP CONSTRAINT "PurchaseItem_purchaseId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_approvedBy_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_cancelledBy_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_createdBy_fkey";

-- DropIndex
DROP INDEX "Sale_saleNumber_key";

-- AlterTable
ALTER TABLE "PurchaseOrder" DROP COLUMN "approvedAt",
DROP COLUMN "approvedBy",
DROP COLUMN "cancellationReason",
DROP COLUMN "cancelledAt",
DROP COLUMN "cancelledBy",
DROP COLUMN "createdBy",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "createdBy",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Purchase";

-- DropTable
DROP TABLE "PurchaseItem";

-- CreateTable
CREATE TABLE "PurchaseOrderHistory" (
    "id" SERIAL NOT NULL,
    "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'PENDING',
    "statusAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "PurchaseOrderHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PurchaseOrderHistory" ADD CONSTRAINT "PurchaseOrderHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderHistory" ADD CONSTRAINT "PurchaseOrderHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
