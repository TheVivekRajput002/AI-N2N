-- CreateTable
CREATE TABLE "workflowTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "tags" TEXT[],
    "nodes" JSONB NOT NULL,
    "graph" JSONB NOT NULL,
    "avgDuration" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT,

    CONSTRAINT "workflowTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "workflowTemplate_ownerId_idx" ON "workflowTemplate"("ownerId");

-- AddForeignKey
ALTER TABLE "workflowTemplate" ADD CONSTRAINT "workflowTemplate_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
