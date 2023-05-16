-- AlterTable
ALTER TABLE "Component" ADD COLUMN     "adminId" TEXT,
ADD COLUMN     "rejectReason" TEXT,
ADD COLUMN     "rejected" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UpdateRequest" ADD COLUMN     "rejectReason" TEXT;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
