/*
  Warnings:

  - You are about to drop the column `references` on the `Articles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Articles" DROP COLUMN "references";

-- CreateTable
CREATE TABLE "ArticleReferences" (
    "id" BIGSERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "articlesId" TEXT NOT NULL,

    CONSTRAINT "ArticleReferences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArticleReferences" ADD CONSTRAINT "ArticleReferences_articlesId_fkey" FOREIGN KEY ("articlesId") REFERENCES "Articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
