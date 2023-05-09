/*
  Warnings:

  - You are about to drop the column `formId` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the `ComponentForm` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `templateId` to the `Component` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_formId_fkey";

-- AlterTable
ALTER TABLE "Component" DROP COLUMN "formId",
ADD COLUMN     "templateId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ComponentForm";

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fields" JSONB NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Template_name_key" ON "Template"("name");

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
