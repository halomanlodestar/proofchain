-- AlterTable
ALTER TABLE "PendingTransaction" ALTER COLUMN "senderId" SET DATA TYPE TEXT,
ALTER COLUMN "recipientId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "RejectedTransaction" ALTER COLUMN "senderId" SET DATA TYPE TEXT,
ALTER COLUMN "recipientId" SET DATA TYPE TEXT;
