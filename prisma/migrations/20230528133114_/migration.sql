/*
  Warnings:

  - You are about to drop the column `userId` on the `Config` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Config` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ComponentInConfig" DROP CONSTRAINT "ComponentInConfig_configId_fkey";

-- DropForeignKey
ALTER TABLE "Config" DROP CONSTRAINT "Config_userId_fkey";

-- AlterTable
ALTER TABLE "Config" DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "FieldType";

-- AddForeignKey
ALTER TABLE "ComponentInConfig" ADD CONSTRAINT "ComponentInConfig_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
