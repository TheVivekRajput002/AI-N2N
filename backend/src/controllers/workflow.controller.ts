import prisma from "../config/db"
import { Request, Response } from "express"

export async function getWorkflows(req: Request, res: Response) {
    const { workspaceId } = req.params as {workspaceId: string}
    try {
        const workflows = await prisma.workflow.findMany({
            where: {
                workspaceId: workspaceId
            }
        })

        return res.status(200).json({
            success: true,
            workflows,
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error
        })
    }
}

export async function createWorkflow(req: Request, res: Response) {

    const { name, description } = req.body as { name: string, description: string }
    const { workspaceId } = req.params as { workspaceId: string }

    try {
        const workflow = await prisma.workflow.create({
            data: {
                name: name,
                description: description,
                workspaceId: workspaceId,
            }
        })

        const version = await prisma.workflowVersion.create({
            data: {
                workflowId: workflow.id,
                versionNumber: 1,
                graph: { nodes: [], edges: [] }, // empty canvas
            },
        });

        const updatedWorkflow = await prisma.workflow.update({
            where: { id: workflow.id },
            data: { currentVersionId: version.id },
        });


        return res.status(200).json({
            success: true,
            workflow: updatedWorkflow
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error
        })
    }
}

export async function deleteWorkflow(req: Request, res: Response) {
    try {
        const { workflowId } = req.params as { workflowId: string }

        if (!workflowId || typeof workflowId !== 'string') {
            return res.status(400).json({
                success: false,
                message: "workflowId not found"
            })
        }

        await prisma.$transaction(async (tx) => {
            // 1. Delete nodeExecutions associated with executions of this workflow
            await tx.nodeExecution.deleteMany({
                where: {
                    execution: {
                        workflowId: workflowId
                    }
                }
            });

            // 2. Delete executions of this workflow
            await tx.execution.deleteMany({
                where: {
                    workflowId: workflowId
                }
            });

            // 3. Set currentVersionId to null on the workflow to avoid circular foreign key dependency errors
            await tx.workflow.update({
                where: { id: workflowId },
                data: { currentVersionId: null }
            });

            // 4. Delete all workflow versions of this workflow
            await tx.workflowVersion.deleteMany({
                where: {
                    workflowId: workflowId
                }
            });

            // 5. Delete the workflow itself
            await tx.workflow.delete({
                where: {
                    id: workflowId
                }
            });
        });

        return res.status(200).json({
            success: true,
            message: "Workflow deleted successfully"
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : String(error)
        })
    }
}


