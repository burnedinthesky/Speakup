/*
  Warnings:

  - You are about to drop the `PrivateUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PrivateUser" DROP CONSTRAINT "PrivateUser_userId_fkey";

-- AlterTable
ALTER TABLE "ArticleModStatus" ADD COLUMN     "moderatorId" TEXT;

-- DropTable
DROP TABLE "PrivateUser";

-- DropEnum
DROP TYPE "PrivateUserRole";

-- AddForeignKey
ALTER TABLE "ArticleModStatus" ADD CONSTRAINT "ArticleModStatus_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
