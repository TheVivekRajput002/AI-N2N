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

        // Create the first version
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

