import { Request, Response } from 'express'
import { getAuth } from '@clerk/express'
import { getOrCreateUser } from './auth.controller'
import prisma from '../config/db'

export async function getTemplates(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req)
        
        let dbUser = null;
        if (userId) {
            dbUser = await getOrCreateUser(userId);
        }

        const templates = await prisma.workflowTemplate.findMany({
            where: {
                OR: [
                    { ownerId: null },
                    ...(dbUser ? [{ ownerId: dbUser.id }] : [])
                ]
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json({
            success: true,
            templates
        });
    } catch (error) {
        console.error("Error in getTemplates:", error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function createTemplate(req: Request, res: Response) {
    try {
        const { name, description, category, color, tags, nodes, graph, avgDuration } = req.body

        if (!name || !description || !category || !color || !nodes || !graph) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields (name, description, category, color, nodes, graph)"
            });
        }

        const { userId } = getAuth(req)
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const dbUser = await getOrCreateUser(userId);

        const template = await prisma.workflowTemplate.create({
            data: {
                name,
                description,
                category,
                color,
                tags: tags || [],
                nodes,
                graph,
                avgDuration: avgDuration || 0,
                ownerId: dbUser.id
            }
        });

        return res.status(201).json({
            success: true,
            message: "Template created successfully",
            template
        });
    } catch (error) {
        console.error("Error in createTemplate:", error)
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : String(error)
        });
    }
}

export async function submitTemplateFromWorkflow(req: Request, res: Response) {
    try {
        const { workflowId, category, tags, description } = req.body

        if (!workflowId) {
            return res.status(400).json({
                success: false,
                message: "Missing required field: workflowId"
            });
        }

        const { userId } = getAuth(req)
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const dbUser = await getOrCreateUser(userId);

        const workflow = await prisma.workflow.findUnique({
            where: { id: workflowId },
            include: {
                currentVersion: true,
                workspace: true
            }
        });

        if (!workflow) {
            return res.status(404).json({
                success: false,
                message: "Workflow not found"
            });
        }

        // Check ownership
        if (workflow.workspace.ownerId !== dbUser.id) {
            return res.status(403).json({
                success: false,
                message: "You do not own this workflow"
            });
        }

        if (!workflow.currentVersion) {
            return res.status(400).json({
                success: false,
                message: "Workflow must have at least one saved version to be submitted as a template"
            });
        }

        const graph = workflow.currentVersion.graph as { nodes?: any[]; edges?: any[] } | null;
        
        // Map nodes to visual node format
        const templateNodes = (graph?.nodes || []).map((node: any) => ({
            label: node.data?.label || node.type || "Node",
            type: node.type || "custom"
        }));

        const template = await prisma.workflowTemplate.create({
            data: {
                name: workflow.name,
                description: description || workflow.description || '',
                category: category || 'AI Agent',
                color: workflow.workspace.color || 'blue',
                tags: tags || [],
                nodes: templateNodes,
                graph: graph || { nodes: [], edges: [] },
                avgDuration: 0,
                ownerId: dbUser.id
            }
        });

        return res.status(201).json({
            success: true,
            message: "Template created successfully from workflow",
            template
        });
    } catch (error) {
        console.error("Error in submitTemplateFromWorkflow:", error)
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : String(error)
        });
    }
}

