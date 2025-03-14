-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'REJECTED', 'CANCELLED', 'SUCCESSFUL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "initialisedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" INTEGER NOT NULL,
    "recipientId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'SUCCESSFUL',
    "expirationTime" TIMESTAMP(3) NOT NULL,
    "signature" TEXT NOT NULL,
    "previousHash" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingTransaction" (
    "id" SERIAL NOT NULL,
    "initialisedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" INTEGER NOT NULL,
    "recipientId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "expirationTime" TIMESTAMP(3) NOT NULL,
    "signature" TEXT NOT NULL,
    "previousHash" TEXT NOT NULL,

    CONSTRAINT "PendingTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RejectedTransaction" (
    "id" SERIAL NOT NULL,
    "initialisedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" INTEGER NOT NULL,
    "recipientId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "expirationTime" TIMESTAMP(3) NOT NULL,
    "signature" TEXT NOT NULL,
    "previousHash" TEXT NOT NULL,
    "rejectionReason" TEXT,

    CONSTRAINT "RejectedTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "sender" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "recipient" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
