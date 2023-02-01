/*
  Warnings:

  - You are about to drop the column `avcArticleId` on the `Argument` table. All the data in the column will be lost.
  - You are about to drop the column `avcArticleId` on the `ArticleModStatus` table. All the data in the column will be lost.
  - You are about to drop the column `avcArticleId` on the `ArticleReports` table. All the data in the column will be lost.
  - You are about to drop the column `articleModStatusId` on the `Articles` table. All the data in the column will be lost.
  - You are about to drop the column `articlesId` on the `AvcArticle` table. All the data in the column will be lost.
  - You are about to drop the column `avcArticleId` on the `Collections` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[articleId]` on the table `ArticleModStatus` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `articleId` to the `ArticleModStatus` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Argument" DROP CONSTRAINT "Argument_avcArticleId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleModStatus" DROP CONSTRAINT "ArticleModStatus_avcArticleId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleReports" DROP CONSTRAINT "ArticleReports_avcArticleId_fkey";

-- DropForeignKey
ALTER TABLE "Collections" DROP CONSTRAINT "Collections_avcArticleId_fkey";

-- DropIndex
DROP INDEX "ArticleModStatus_avcArticleId_key";

-- AlterTable
ALTER TABLE "Argument" DROP COLUMN "avcArticleId";

-- AlterTable
ALTER TABLE "ArticleModStatus" DROP COLUMN "avcArticleId",
ADD COLUMN     "articleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ArticleReports" DROP COLUMN "avcArticleId";

-- AlterTable
ALTER TABLE "Articles" DROP COLUMN "articleModStatusId";

-- AlterTable
ALTER TABLE "AvcArticle" DROP COLUMN "articlesId";

-- AlterTable
ALTER TABLE "Collections" DROP COLUMN "avcArticleId";

-- CreateIndex
CREATE UNIQUE INDEX "ArticleModStatus_articleId_key" ON "ArticleModStatus"("articleId");

-- AddForeignKey
ALTER TABLE "ArticleModStatus" ADD CONSTRAINT "ArticleModStatus_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "AvcArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
