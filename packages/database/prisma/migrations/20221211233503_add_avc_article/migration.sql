/*
  Warnings:

  - You are about to drop the column `articlesId` on the `ArticleModStatus` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[avcArticleId]` on the table `ArticleModStatus` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `avcArticleId` to the `ArticleModStatus` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ArticleModStatus" DROP CONSTRAINT "ArticleModStatus_articlesId_fkey";

-- DropForeignKey
ALTER TABLE "Articles" DROP CONSTRAINT "Articles_authorId_fkey";

-- DropIndex
DROP INDEX "ArticleModStatus_articlesId_key";

-- AlterTable
ALTER TABLE "Argument" ADD COLUMN     "avcArticleId" TEXT;

-- AlterTable
ALTER TABLE "ArticleModStatus" DROP COLUMN "articlesId",
ADD COLUMN     "avcArticleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ArticleReferences" ADD COLUMN     "avcArticleId" TEXT;

-- AlterTable
ALTER TABLE "ArticleReports" ADD COLUMN     "avcArticleId" TEXT;

-- AlterTable
ALTER TABLE "Articles" ADD COLUMN     "articleModStatusId" INTEGER;

-- AlterTable
ALTER TABLE "Collections" ADD COLUMN     "avcArticleId" TEXT;

-- CreateTable
CREATE TABLE "AvcArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tags" TEXT[],
    "authorId" TEXT NOT NULL,
    "brief" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "articleModStatusId" INTEGER,

    CONSTRAINT "AvcArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AvcArticle_title_key" ON "AvcArticle"("title");

-- CreateIndex
CREATE UNIQUE INDEX "AvcArticle_authorId_key" ON "AvcArticle"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleModStatus_avcArticleId_key" ON "ArticleModStatus"("avcArticleId");

-- AddForeignKey
ALTER TABLE "Collections" ADD CONSTRAINT "Collections_avcArticleId_fkey" FOREIGN KEY ("avcArticleId") REFERENCES "AvcArticle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvcArticle" ADD CONSTRAINT "AvcArticle_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleModStatus" ADD CONSTRAINT "ArticleModStatus_avcArticleId_fkey" FOREIGN KEY ("avcArticleId") REFERENCES "AvcArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleReferences" ADD CONSTRAINT "ArticleReferences_avcArticleId_fkey" FOREIGN KEY ("avcArticleId") REFERENCES "AvcArticle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleReports" ADD CONSTRAINT "ArticleReports_avcArticleId_fkey" FOREIGN KEY ("avcArticleId") REFERENCES "AvcArticle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Argument" ADD CONSTRAINT "Argument_avcArticleId_fkey" FOREIGN KEY ("avcArticleId") REFERENCES "AvcArticle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
