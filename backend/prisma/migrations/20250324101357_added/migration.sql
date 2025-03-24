-- CreateEnum
CREATE TYPE "TransactionMode" AS ENUM ('CASH', 'UPI');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "mode" "TransactionMode" NOT NULL DEFAULT 'CASH';
