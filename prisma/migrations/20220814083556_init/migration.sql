/*
  Warnings:

  - You are about to drop the column `commentCount` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `dislikedCount` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `likedCount` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `supportedCount` on the `Comments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "commentCount",
DROP COLUMN "dislikedCount",
DROP COLUMN "likedCount",
DROP COLUMN "supportedCount";

-- CreateTable
CREATE TABLE "LikedUsersOnComments" (
    "userId" TEXT NOT NULL,
    "commentsId" INTEGER NOT NULL,

    CONSTRAINT "LikedUsersOnComments_pkey" PRIMARY KEY ("commentsId","userId")
);

-- CreateTable
CREATE TABLE "DislikedUsersOnComments" (
    "userId" TEXT NOT NULL,
    "commentsId" INTEGER NOT NULL,

    CONSTRAINT "DislikedUsersOnComments_pkey" PRIMARY KEY ("commentsId","userId")
);

-- CreateTable
CREATE TABLE "SupportedUsersOnComments" (
    "userId" TEXT NOT NULL,
    "commentsId" INTEGER NOT NULL,

    CONSTRAINT "SupportedUsersOnComments_pkey" PRIMARY KEY ("commentsId","userId")
);

-- AddForeignKey
ALTER TABLE "LikedUsersOnComments" ADD CONSTRAINT "LikedUsersOnComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedUsersOnComments" ADD CONSTRAINT "LikedUsersOnComments_commentsId_fkey" FOREIGN KEY ("commentsId") REFERENCES "Comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DislikedUsersOnComments" ADD CONSTRAINT "DislikedUsersOnComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DislikedUsersOnComments" ADD CONSTRAINT "DislikedUsersOnComments_commentsId_fkey" FOREIGN KEY ("commentsId") REFERENCES "Comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportedUsersOnComments" ADD CONSTRAINT "SupportedUsersOnComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportedUsersOnComments" ADD CONSTRAINT "SupportedUsersOnComments_commentsId_fkey" FOREIGN KEY ("commentsId") REFERENCES "Comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
