import prisma from '../config/db'
import { clerkClient } from "@clerk/express";
import { getAuth } from '@clerk/express'


export async function kuch(req: any, res: any) {

    try {
        const { userId } = getAuth(req)
        // console.log("userId", userId)
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const user = await getOrCreateUser(userId)
        res.status(200).json({
            user
        })
       
    } catch (error) {
        console.log("error in kuch", error)
    }


}

export async function getOrCreateUser(clerkId: string) {

    let user = await prisma.user.findUnique(
        {
            where: {
                clerkId
            }
        }
    )

    if (user) {
        return user;
    } else {
        const clerkUser = await clerkClient.users.getUser(clerkId);

        user = await prisma.user.create({
            data: {
                clerkId,
                email: clerkUser.emailAddresses[0].emailAddress,
                name: clerkUser.firstName + " " + clerkUser.lastName,
            }
        })

        return user;
    }


}

export async function markWelcomeSeen(req: any, res: any) {
    try {
        const { userId } = getAuth(req)
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const user = await prisma.user.update({
            where: {
                clerkId: userId
            },
            data: {
                hasSeenWelcome: true
            }
        })

        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log("error in markWelcomeSeen", error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


