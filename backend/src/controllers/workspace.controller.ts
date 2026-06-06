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
            workspaces: workspaces
        })
    } catch (error) {
        console.log("error in getWorkspace", error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }

}
export async function createWorkspace(req: Request, res: Response) {

}



