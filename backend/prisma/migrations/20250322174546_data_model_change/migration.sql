/*
  Warnings:

  - You are about to drop the `PendingTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RejectedTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PendingTransaction" DROP CONSTRAINT "PendingTransaction_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "PendingTransaction" DROP CONSTRAINT "PendingTransaction_senderId_fkey";

-- DropForeignKey
ALTER TABLE "PendingTransaction" DROP CONSTRAINT "PendingTransaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "RejectedTransaction" DROP CONSTRAINT "RejectedTransaction_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "RejectedTransaction" DROP CONSTRAINT "RejectedTransaction_senderId_fkey";

-- DropForeignKey
ALTER TABLE "RejectedTransaction" DROP CONSTRAINT "RejectedTransaction_userId_fkey";

-- DropTable
DROP TABLE "PendingTransaction";

-- DropTable
DROP TABLE "RejectedTransaction";
