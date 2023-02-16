-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "position" SERIAL NOT NULL,
ADD COLUMN     "showInConfigurator" BOOLEAN NOT NULL DEFAULT false;
