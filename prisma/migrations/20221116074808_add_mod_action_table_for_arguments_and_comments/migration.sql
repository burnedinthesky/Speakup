/*
  Warnings:

  - You are about to drop the column `deletedTime` on the `Argument` table. All the data in the column will be lost.
  - You are about to drop the column `deletedTime` on the `Comments` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ModActionInstances" AS ENUM ('FIRST', 'SECOND');

-- AlterTable
ALTER TABLE "Argument" DROP COLUMN "deletedTime";

-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "deletedTime";

-- CreateTable
CREATE TABLE "ArgumentModAction" (
    "id" SERIAL NOT NULL,
    "instance" "ModActionInstances" NOT NULL,
    "issuedTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" JSONB NOT NULL,
    "argumentId" INTEGER NOT NULL,

    CONSTRAINT "ArgumentModAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentModAction" (
    "id" SERIAL NOT NULL,
    "instance" "ModActionInstances" NOT NULL,
    "issuedTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" JSONB NOT NULL,
    "commentsId" INTEGER NOT NULL,

    CONSTRAINT "CommentModAction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArgumentModAction" ADD CONSTRAINT "ArgumentModAction_argumentId_fkey" FOREIGN KEY ("argumentId") REFERENCES "Argument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentModAction" ADD CONSTRAINT "CommentModAction_commentsId_fkey" FOREIGN KEY ("commentsId") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
