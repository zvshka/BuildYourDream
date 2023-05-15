-- DropForeignKey
ALTER TABLE "UpdateRequest" DROP CONSTRAINT "UpdateRequest_adminId_fkey";

-- AlterTable
ALTER TABLE "UpdateRequest" ALTER COLUMN "adminId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UpdateRequest" ADD CONSTRAINT "UpdateRequest_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
