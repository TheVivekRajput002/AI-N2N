-- DropForeignKey
ALTER TABLE "workflow" DROP CONSTRAINT "workflow_currentVersionId_fkey";

-- AlterTable
ALTER TABLE "workflow" ALTER COLUMN "currentVersionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "workflow" ADD CONSTRAINT "workflow_currentVersionId_fkey" FOREIGN KEY ("currentVersionId") REFERENCES "workflowVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
