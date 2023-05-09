-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarURL" TEXT;

-- CreateTable
CREATE TABLE "Image" (
    "filename" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_filename_key" ON "Image"("filename");
