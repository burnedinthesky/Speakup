-- CreateEnum
CREATE TYPE "UserActionType" AS ENUM ('POST_ARGUMENT', 'POST_COMMENT', 'POST_ARTICLE');

-- CreateTable
CREATE TABLE "Log_UserActions" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "UserActionType" NOT NULL,
    "metadata" JSONB NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_UserActions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Log_UserActions" ADD CONSTRAINT "Log_UserActions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
