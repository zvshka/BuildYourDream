/*
  Warnings:

  - You are about to drop the column `filepath` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "filepath",
DROP COLUMN "size";
