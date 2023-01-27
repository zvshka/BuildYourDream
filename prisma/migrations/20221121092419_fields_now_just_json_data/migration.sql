/*
  Warnings:

  - You are about to drop the `Field` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fields` to the `ComponentForm` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Field" DROP CONSTRAINT "Field_formId_fkey";

-- AlterTable
ALTER TABLE "ComponentForm" ADD COLUMN     "fields" JSONB NOT NULL;

-- DropTable
DROP TABLE "Field";
