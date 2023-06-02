-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_configId_fkey";

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "expiredAt" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config"("id") ON DELETE CASCADE ON UPDATE CASCADE;
