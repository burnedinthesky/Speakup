-- AlterTable
ALTER TABLE "Argument" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedTime" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedTime" TIMESTAMP(3);
