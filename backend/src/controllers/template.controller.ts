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
