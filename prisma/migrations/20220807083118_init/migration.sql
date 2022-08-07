/*
  Warnings:

  - Added the required column `commentCount` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viewsCount` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "commentCount" INTEGER NOT NULL,
ADD COLUMN     "viewsCount" INTEGER NOT NULL;
