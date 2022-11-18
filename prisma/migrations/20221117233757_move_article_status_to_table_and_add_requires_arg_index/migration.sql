/*
  Warnings:

  - You are about to drop the column `status` on the `Articles` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ArticleModStates" AS ENUM ('pending_mod', 'passed');

-- AlterTable
ALTER TABLE "Articles" DROP COLUMN "status",
ADD COLUMN     "requiresArgIndex" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "ArticleModStatus" (
    "id" SERIAL NOT NULL,
    "status" "ArticleModStates" NOT NULL DEFAULT 'pending_mod',
    "desc" TEXT NOT NULL DEFAULT '正在等候審核',
    "articlesId" TEXT NOT NULL,

    CONSTRAINT "ArticleModStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticleModStatus_articlesId_key" ON "ArticleModStatus"("articlesId");

-- AddForeignKey
ALTER TABLE "ArticleModStatus" ADD CONSTRAINT "ArticleModStatus_articlesId_fkey" FOREIGN KEY ("articlesId") REFERENCES "Articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
