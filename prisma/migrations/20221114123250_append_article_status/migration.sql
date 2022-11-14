-- AlterTable
ALTER TABLE "Articles" ADD COLUMN     "status" JSONB NOT NULL DEFAULT '{"status": "pending_mod", "desc": "正在等候審核"}';
