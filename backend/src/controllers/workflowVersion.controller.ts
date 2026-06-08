import { Request, Response } from 'express';
import prisma from '@/config/db';

// model workflowVersion {
//   id            String      @id @default(uuid())
//   versionNumber Int
//   graph         Json
//   createdAt     DateTime    @default(now())

//   workflowId    String
//   workflow workflow @relation("AllVersions", fields: [workflowId], references: [id])

//   currentFor     workflow?   @relation("CurrentVersion")
//   executions    execution[]

// @@unique([workflowId, versionNumber])
// @@index([workflowId])
// }

export async function createWorkflowVersion(req: Request, res: Response) {

    try {

        const { graph, workflowId } = req.body

        const latest = await prisma.workflowVersion.findFirst({
            where: { workflowId },
            orderBy: { versionNumber: "desc" },
        });

        const nextNumber = latest ? latest.versionNumber + 1 : 1;

        const workflowVersion = await prisma.workflowVersion.create({
            data: {
                workflowId,
                versionNumber: nextNumber,
                graph,
            }
        })

        const updatedWorkflow = await prisma.workflow.update({
            where: { id: workflowId },
            data: {
                currentVersionId: workflowVersion.id
            }
        })

        res.status(201).json({
            success: true,
            workflowVersion,
            workflow: updatedWorkflow
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error
        })
        console.log(error)

    }

}

export async function getWorkflowVersion(req: Request, res: Response) {

    try {
        const { workflowId } = req.query as { workflowId: string };

        if (!workflowId) {
            res.status(400).json({
                success: false,
                message: "workflowId is required"
            });
            return;
        }

        const workflow = await prisma.workflow.findUnique({
            where: {
                id: workflowId,
            },
            include: {
                currentVersion: true,
                workspace: true
            }
        });

        if (!workflow) {
            res.status(404).json({
                success: false,
                message: "Workflow not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            workflowVersion: workflow.currentVersion,
            workflowName: workflow.name,
            workspaceName: workflow.workspace.name,
            createdAt: workflow.createdAt,
            updatedAt: workflow.updatedAt,
            description: workflow.description,
            isEnabled: workflow.isEnabled
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error"
        });
        console.log(error);

    }

}

