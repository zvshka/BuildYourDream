/*
  Warnings:

  - Added the required column `expiredAt` to the `EmailVerification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiredAt` to the `PasswordReset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmailVerification" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiredAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PasswordReset" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiredAt" TIMESTAMP(3) NOT NULL;
