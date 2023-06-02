-- AlterTable
ALTER TABLE "Component" ADD COLUMN     "creatorId" TEXT;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
