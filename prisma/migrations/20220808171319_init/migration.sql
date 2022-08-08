/*
  Warnings:

  - You are about to drop the column `viewsCount` on the `Comments` table. All the data in the column will be lost.
  - Added the required column `dislikedCount` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `likedCount` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supportedCount` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "viewsCount",
ADD COLUMN     "dislikedCount" INTEGER NOT NULL,
ADD COLUMN     "likedCount" INTEGER NOT NULL,
ADD COLUMN     "supportedCount" INTEGER NOT NULL;
