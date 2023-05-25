-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "threadCommentId" TEXT;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_threadCommentId_fkey" FOREIGN KEY ("threadCommentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
