/*
  Warnings:

  - You are about to drop the column `avatarURL` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarURL",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bio" TEXT;
