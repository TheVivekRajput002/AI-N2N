import { Request, Response } from 'express'
import { getAuth } from '@clerk/express'
import { getOrCreateUser } from './auth.controller'
import prisma from '../config/db'

export async function getWorkspaces(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req)
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const user = await getOrCreateUser(userId)

        const workspaces = await prisma.workspace.findMany({
            where: {
                ownerId: user.id
            }
        })

        return res.status(200).json({
            workspaces: workspaces,
            hasSeenWelcome: user.hasSeenWelcome
        })
    } catch (error) {
        console.log("error in getWorkspace", error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }

}
export async function createWorkspace(req: Request, res: Response) {
    try {

        const { name, description, color } = req.body

        if (!name || !description || !color) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const { userId } = getAuth(req)
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "user doesnt exist"
            })
        }

        const user = await getOrCreateUser(userId)

        const workspace = await prisma.workspace.create({
            data: {
                name,
                description,
                color,
                ownerId: user.id
            }
        })

        return res.status(201).json({
            success: true,
            message: "Workspace created successfully",
            workspace
        })


    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error
        })
    }

}
export async function deleteWorkspace(req: Request, res: Response) {
    try {

        const { id } = req.params

        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                message: "id not found"
            })
        }

        await prisma.workspace.delete({
            where: {
                id
            }
        })

        return res.status(201).json({
            success: true,
            message: "Workspace deleted successfully",
        })


    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error
        })
    }

}



