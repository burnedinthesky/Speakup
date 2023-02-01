/*
  Warnings:

  - A unique constraint covering the columns `[id,pagnationSequence]` on the table `Argument` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ArticleModStatus" DROP CONSTRAINT "ArticleModStatus_articlesId_fkey";

-- DropIndex
DROP INDEX "Argument_pagnationSequence_key";

-- CreateIndex
CREATE UNIQUE INDEX "Argument_id_pagnationSequence_key" ON "Argument"("id", "pagnationSequence");

-- AddForeignKey
ALTER TABLE "ArticleModStatus" ADD CONSTRAINT "ArticleModStatus_articlesId_fkey" FOREIGN KEY ("articlesId") REFERENCES "Articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
