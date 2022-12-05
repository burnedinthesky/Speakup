/*
  Warnings:

  - You are about to drop the column `tagPreference` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "tagPreference";

-- CreateTable
CREATE TABLE "UserTagPreference" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "ent" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "env" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "jus" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "cnd" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "eco" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "min" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "mda" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "med" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "eth" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "pol" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "edu" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "fam" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "fem" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "lib" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "rel" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "tec" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "plc" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "scm" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "spr" DOUBLE PRECISION NOT NULL DEFAULT 0.1,

    CONSTRAINT "UserTagPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTagPreference_id_key" ON "UserTagPreference"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserTagPreference_userId_key" ON "UserTagPreference"("userId");

-- AddForeignKey
ALTER TABLE "UserTagPreference" ADD CONSTRAINT "UserTagPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
