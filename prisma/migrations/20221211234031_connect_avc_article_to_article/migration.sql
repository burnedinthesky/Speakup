/*
  Warnings:

  - A unique constraint covering the columns `[avcArticleId]` on the table `Articles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `avcArticleId` to the `Articles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `articlesId` to the `AvcArticle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Articles" ADD COLUMN     "avcArticleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AvcArticle" ADD COLUMN     "articlesId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Articles_avcArticleId_key" ON "Articles"("avcArticleId");

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_avcArticleId_fkey" FOREIGN KEY ("avcArticleId") REFERENCES "AvcArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
