-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "rejected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rejectedAt" TIMESTAMP(3),
ADD COLUMN     "warns" INTEGER,
ALTER COLUMN "approvedAt" DROP NOT NULL;
