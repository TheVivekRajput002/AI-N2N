import dotenv from 'dotenv'

dotenv.config()


if(!process.env.PORT){
    throw new Error('PORT not found')
}

if(!process.env.DATABASE_URL){
    throw new Error('DATABASE_URL not found')
}

if(!process.env.CLERK_SECRET_KEY){
    throw new Error('CLERK_SECRET_KEY not found')
}

if(!process.env.CLERK_PUBLISHABLE_KEY){
    throw new Error('CLERK_PUBLISHABLE_KEY not found')
}

// if(!process.env.FRONTEND_URL){
//     throw new Error('FRONTEND_URL not found')
// }

export const config = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    FRONTEND_URL: process.env.FRONTEND_URL
}