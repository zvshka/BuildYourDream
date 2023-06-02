-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_replyCommentId_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "replyCommentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_replyCommentId_fkey" FOREIGN KEY ("replyCommentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
