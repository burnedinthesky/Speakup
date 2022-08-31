/*
  Warnings:

  - You are about to drop the column `h1` on the `Articles` table. All the data in the column will be lost.
  - You are about to drop the column `h2` on the `Articles` table. All the data in the column will be lost.
  - You are about to drop the column `h3` on the `Articles` table. All the data in the column will be lost.
  - You are about to drop the column `spoiler` on the `Articles` table. All the data in the column will be lost.
  - You are about to drop the column `articleId` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `onside` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the `CommentReply` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[title]` on the table `Articles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[threadId]` on the table `Articles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `references` to the `Articles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `threadId` to the `Articles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Articles` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `content` on the `Articles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `stance` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CommentReply" DROP CONSTRAINT "CommentReply_motherCommentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentReply" DROP CONSTRAINT "CommentReply_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_articleId_fkey";

-- AlterTable
ALTER TABLE "Articles" DROP COLUMN "h1",
DROP COLUMN "h2",
DROP COLUMN "h3",
DROP COLUMN "spoiler",
ADD COLUMN     "references" JSONB NOT NULL,
ADD COLUMN     "threadId" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "content",
ADD COLUMN     "content" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "articleId",
DROP COLUMN "onside",
ADD COLUMN     "stance" VARCHAR(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileImg" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "CommentReply";

-- CreateTable
CREATE TABLE "Threads" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CommentsToThreads" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CommentsToThreads_AB_unique" ON "_CommentsToThreads"("A", "B");

-- CreateIndex
CREATE INDEX "_CommentsToThreads_B_index" ON "_CommentsToThreads"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Articles_title_key" ON "Articles"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Articles_threadId_key" ON "Articles"("threadId");

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommentsToThreads" ADD CONSTRAINT "_CommentsToThreads_A_fkey" FOREIGN KEY ("A") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommentsToThreads" ADD CONSTRAINT "_CommentsToThreads_B_fkey" FOREIGN KEY ("B") REFERENCES "Threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
