/*
  Warnings:

  - Added the required column `formId` to the `Component` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Component" ADD COLUMN     "formId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_formId_fkey" FOREIGN KEY ("formId") REFERENCES "ComponentForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
