-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'CREATOR', 'SENIORCREATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('m', 'f', 'o');

-- CreateEnum
CREATE TYPE "PrivateUserRole" AS ENUM ('USER', 'SYSTEMADMIN');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "CredEmailLimiter" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "lastEmailSent" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dayStartTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailsSentInDay" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CredEmailLimiter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CredEmailVerToken" (
    "id" TEXT NOT NULL,
    "valToken" TEXT NOT NULL,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "expiers" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CredEmailVerToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" CHAR(64),
    "profileImg" TEXT,
    "birthday" TIMESTAMP(3),
    "gender" "Gender",
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "onBoarded" BOOLEAN NOT NULL DEFAULT false,
    "tagPreference" JSONB NOT NULL DEFAULT '[{"slug": "ent", "pref": 0.1}, {"slug": "env", "pref": 0.1}, {"slug": "jus", "pref": 0.1}, {"slug": "cnd", "pref": 0.1}, {"slug": "eco", "pref": 0.1}, {"slug": "min", "pref": 0.1}, {"slug": "mda", "pref": 0.1}, {"slug": "med", "pref": 0.1}, {"slug": "eth", "pref": 0.1}, {"slug": "pol", "pref": 0.1}, {"slug": "edu", "pref": 0.1}, {"slug": "fam", "pref": 0.1}, {"slug": "fem", "pref": 0.1}, {"slug": "lib", "pref": 0.1}, {"slug": "rel", "pref": 0.1}, {"slug": "tec", "pref": 0.1}, {"slug": "plc", "pref": 0.1}, {"slug": "scm", "pref": 0.1}, {"slug": "spr", "pref": 0.1}]',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivateUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "PrivateUserRole" NOT NULL DEFAULT 'USER',
    "authToken" VARCHAR(64),

    CONSTRAINT "PrivateUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionSet" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collections" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "createdTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tags" TEXT[],
    "authorId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "references" JSONB NOT NULL,
    "createdTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "articleScore" DOUBLE PRECISION NOT NULL DEFAULT 20,

    CONSTRAINT "Articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleViews" (
    "id" BIGSERIAL NOT NULL,
    "ip" TEXT,
    "userId" TEXT,

    CONSTRAINT "ArticleViews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleReports" (
    "id" SERIAL NOT NULL,
    "reasons" TEXT[],
    "createdTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "articlesId" TEXT NOT NULL,

    CONSTRAINT "ArticleReports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Argument" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stance" TEXT NOT NULL,
    "pagnationSequence" SERIAL NOT NULL,
    "articleId" TEXT NOT NULL,

    CONSTRAINT "Argument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArgumentThread" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "argumentId" INTEGER NOT NULL,

    CONSTRAINT "ArgumentThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArgumentReports" (
    "id" SERIAL NOT NULL,
    "reasons" TEXT[],
    "createdTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "argumentId" INTEGER NOT NULL,

    CONSTRAINT "ArgumentReports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stance" TEXT NOT NULL,
    "inArgumentId" INTEGER NOT NULL,
    "argumentThreadId" INTEGER,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentReports" (
    "id" SERIAL NOT NULL,
    "reasons" TEXT[],
    "createdTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "commentsId" INTEGER NOT NULL,

    CONSTRAINT "CommentReports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CollectionSetToCollections" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_likedArguments" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_supportedArguments" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_dislikedArguments" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_likedComments" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_supportedComments" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_dislikedComments" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "CredEmailLimiter_userId_key" ON "CredEmailLimiter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CredEmailVerToken_userId_key" ON "CredEmailVerToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateUser_id_key" ON "PrivateUser"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateUser_userId_key" ON "PrivateUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateUser_authToken_key" ON "PrivateUser"("authToken");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionSet_id_key" ON "CollectionSet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Collections_id_key" ON "Collections"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Collections_articleId_userId_key" ON "Collections"("articleId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Articles_title_key" ON "Articles"("title");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleViews_ip_userId_key" ON "ArticleViews"("ip", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleReports_userId_articlesId_key" ON "ArticleReports"("userId", "articlesId");

-- CreateIndex
CREATE UNIQUE INDEX "Argument_pagnationSequence_key" ON "Argument"("pagnationSequence");

-- CreateIndex
CREATE UNIQUE INDEX "ArgumentThread_argumentId_name_key" ON "ArgumentThread"("argumentId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ArgumentReports_userId_argumentId_key" ON "ArgumentReports"("userId", "argumentId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentReports_userId_commentsId_key" ON "CommentReports"("userId", "commentsId");

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionSetToCollections_AB_unique" ON "_CollectionSetToCollections"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionSetToCollections_B_index" ON "_CollectionSetToCollections"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_likedArguments_AB_unique" ON "_likedArguments"("A", "B");

-- CreateIndex
CREATE INDEX "_likedArguments_B_index" ON "_likedArguments"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_supportedArguments_AB_unique" ON "_supportedArguments"("A", "B");

-- CreateIndex
CREATE INDEX "_supportedArguments_B_index" ON "_supportedArguments"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_dislikedArguments_AB_unique" ON "_dislikedArguments"("A", "B");

-- CreateIndex
CREATE INDEX "_dislikedArguments_B_index" ON "_dislikedArguments"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_likedComments_AB_unique" ON "_likedComments"("A", "B");

-- CreateIndex
CREATE INDEX "_likedComments_B_index" ON "_likedComments"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_supportedComments_AB_unique" ON "_supportedComments"("A", "B");

-- CreateIndex
CREATE INDEX "_supportedComments_B_index" ON "_supportedComments"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_dislikedComments_AB_unique" ON "_dislikedComments"("A", "B");

-- CreateIndex
CREATE INDEX "_dislikedComments_B_index" ON "_dislikedComments"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CredEmailLimiter" ADD CONSTRAINT "CredEmailLimiter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CredEmailVerToken" ADD CONSTRAINT "CredEmailVerToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateUser" ADD CONSTRAINT "PrivateUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionSet" ADD CONSTRAINT "CollectionSet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collections" ADD CONSTRAINT "Collections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collections" ADD CONSTRAINT "Collections_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleViews" ADD CONSTRAINT "ArticleViews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleReports" ADD CONSTRAINT "ArticleReports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleReports" ADD CONSTRAINT "ArticleReports_articlesId_fkey" FOREIGN KEY ("articlesId") REFERENCES "Articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Argument" ADD CONSTRAINT "Argument_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Argument" ADD CONSTRAINT "Argument_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArgumentThread" ADD CONSTRAINT "ArgumentThread_argumentId_fkey" FOREIGN KEY ("argumentId") REFERENCES "Argument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArgumentReports" ADD CONSTRAINT "ArgumentReports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArgumentReports" ADD CONSTRAINT "ArgumentReports_argumentId_fkey" FOREIGN KEY ("argumentId") REFERENCES "Argument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_inArgumentId_fkey" FOREIGN KEY ("inArgumentId") REFERENCES "Argument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_argumentThreadId_fkey" FOREIGN KEY ("argumentThreadId") REFERENCES "ArgumentThread"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReports" ADD CONSTRAINT "CommentReports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReports" ADD CONSTRAINT "CommentReports_commentsId_fkey" FOREIGN KEY ("commentsId") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionSetToCollections" ADD CONSTRAINT "_CollectionSetToCollections_A_fkey" FOREIGN KEY ("A") REFERENCES "CollectionSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionSetToCollections" ADD CONSTRAINT "_CollectionSetToCollections_B_fkey" FOREIGN KEY ("B") REFERENCES "Collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likedArguments" ADD CONSTRAINT "_likedArguments_A_fkey" FOREIGN KEY ("A") REFERENCES "Argument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likedArguments" ADD CONSTRAINT "_likedArguments_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_supportedArguments" ADD CONSTRAINT "_supportedArguments_A_fkey" FOREIGN KEY ("A") REFERENCES "Argument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_supportedArguments" ADD CONSTRAINT "_supportedArguments_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dislikedArguments" ADD CONSTRAINT "_dislikedArguments_A_fkey" FOREIGN KEY ("A") REFERENCES "Argument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dislikedArguments" ADD CONSTRAINT "_dislikedArguments_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likedComments" ADD CONSTRAINT "_likedComments_A_fkey" FOREIGN KEY ("A") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likedComments" ADD CONSTRAINT "_likedComments_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_supportedComments" ADD CONSTRAINT "_supportedComments_A_fkey" FOREIGN KEY ("A") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_supportedComments" ADD CONSTRAINT "_supportedComments_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dislikedComments" ADD CONSTRAINT "_dislikedComments_A_fkey" FOREIGN KEY ("A") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dislikedComments" ADD CONSTRAINT "_dislikedComments_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
