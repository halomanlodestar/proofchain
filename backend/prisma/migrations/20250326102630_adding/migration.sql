/*
  Warnings:

  - You are about to drop the column `acceptedAt` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `initialisedAt` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "acceptedAt",
DROP COLUMN "initialisedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
