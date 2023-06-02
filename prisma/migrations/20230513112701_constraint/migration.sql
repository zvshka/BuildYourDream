/*
  Warnings:

  - You are about to drop the column `constraits` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the column `slots` on the `Template` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Template" DROP COLUMN "constraits",
DROP COLUMN "slots";

-- CreateTable
CREATE TABLE "Constraint" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Constraint_pkey" PRIMARY KEY ("id")
);
