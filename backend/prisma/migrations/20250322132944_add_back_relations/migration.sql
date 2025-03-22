-- AlterTable
ALTER TABLE "PendingTransaction" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "RejectedTransaction" ADD COLUMN     "userId" TEXT,
ALTER COLUMN "status" SET DEFAULT 'REJECTED';

-- AddForeignKey
ALTER TABLE "PendingTransaction" ADD CONSTRAINT "PendingTransaction_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingTransaction" ADD CONSTRAINT "PendingTransaction_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingTransaction" ADD CONSTRAINT "PendingTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectedTransaction" ADD CONSTRAINT "RejectedTransaction_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectedTransaction" ADD CONSTRAINT "RejectedTransaction_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectedTransaction" ADD CONSTRAINT "RejectedTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
