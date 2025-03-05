-- CreateEnum
CREATE TYPE "CityOp" AS ENUM ('LP', 'CBBA');

-- CreateEnum
CREATE TYPE "ObjStatusOp" AS ENUM ('INCOMPLETE', 'COMPLETE');

-- CreateEnum
CREATE TYPE "TransactionTypeOp" AS ENUM ('PENDING', 'PAID');

-- CreateEnum
CREATE TYPE "BatchStatusOp" AS ENUM ('PREPARED', 'PAID');

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "license" VARCHAR(100),
    "cellphone" BIGINT,
    "city" "CityOp" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" SERIAL NOT NULL,
    "referrerId" INTEGER NOT NULL,
    "referredId" INTEGER NOT NULL,
    "referralDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "objStatus" "ObjStatusOp" NOT NULL DEFAULT 'INCOMPLETE',
    "objCompleteDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" SERIAL NOT NULL,
    "batchStatus" "BatchStatusOp" NOT NULL DEFAULT 'PREPARED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "driverId" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "transactionType" "TransactionTypeOp",
    "note" VARCHAR(255),
    "batchId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredId_fkey" FOREIGN KEY ("referredId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
