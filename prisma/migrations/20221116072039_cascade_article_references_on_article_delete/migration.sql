-- DropForeignKey
ALTER TABLE "ArticleReferences" DROP CONSTRAINT "ArticleReferences_articlesId_fkey";

-- AddForeignKey
ALTER TABLE "ArticleReferences" ADD CONSTRAINT "ArticleReferences_articlesId_fkey" FOREIGN KEY ("articlesId") REFERENCES "Articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
