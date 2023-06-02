-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_configId_fkey";

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config"("id") ON DELETE SET NULL ON UPDATE CASCADE;
