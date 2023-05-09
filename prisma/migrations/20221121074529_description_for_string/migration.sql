/*
  Warnings:

  - Added the required column `description` to the `Field` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Field" ADD COLUMN     "description" TEXT NOT NULL;
