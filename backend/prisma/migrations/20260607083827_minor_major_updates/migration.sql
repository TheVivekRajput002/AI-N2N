/*
  Warnings:

  - The `triggeredBy` column on the `execution` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `Output` on the `nodeExecution` table. All the data in the column will be lost.
  - The `status` column on the `nodeExecution` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[workflowId,versionNumber]` on the table `workflowVersion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TriggerType" AS ENUM ('API', 'MANUAL', 'RETRY');

-- CreateEnum
CREATE TYPE "nodeExecutionStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'SKIPPED');

-- AlterEnum
ALTER TYPE "ExecutionStatus" ADD VALUE 'CANCELLED';

-- DropForeignKey
ALTER TABLE "execution" DROP CONSTRAINT "execution_triggeredBy_fkey";

-- AlterTable
ALTER TABLE "execution" ADD COLUMN     "error" TEXT,
ADD COLUMN     "input" JSONB,
ADD COLUMN     "output" JSONB,
DROP COLUMN "triggeredBy",
ADD COLUMN     "triggeredBy" "TriggerType" NOT NULL DEFAULT 'API';

-- AlterTable
ALTER TABLE "nodeExecution" DROP COLUMN "Output",
ADD COLUMN     "output" JSONB,
DROP COLUMN "status",
ADD COLUMN     "status" "nodeExecutionStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "apiKey_userId_idx" ON "apiKey"("userId");

-- CreateIndex
CREATE INDEX "execution_workflowId_idx" ON "execution"("workflowId");

-- CreateIndex
CREATE INDEX "execution_versionId_idx" ON "execution"("versionId");

-- CreateIndex
CREATE INDEX "execution_status_idx" ON "execution"("status");

-- CreateIndex
CREATE INDEX "execution_startedAt_idx" ON "execution"("startedAt");

-- CreateIndex
CREATE INDEX "nodeExecution_executionId_idx" ON "nodeExecution"("executionId");

-- CreateIndex
CREATE INDEX "nodeExecution_nodeId_idx" ON "nodeExecution"("nodeId");

-- CreateIndex
CREATE INDEX "nodeExecution_status_idx" ON "nodeExecution"("status");

-- CreateIndex
CREATE INDEX "user_clerkId_idx" ON "user"("clerkId");

-- CreateIndex
CREATE INDEX "workflow_workspaceId_idx" ON "workflow"("workspaceId");

-- CreateIndex
CREATE INDEX "workflowVersion_workflowId_idx" ON "workflowVersion"("workflowId");

-- CreateIndex
CREATE UNIQUE INDEX "workflowVersion_workflowId_versionNumber_key" ON "workflowVersion"("workflowId", "versionNumber");

-- CreateIndex
CREATE INDEX "workspace_ownerId_idx" ON "workspace"("ownerId");
