import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRouter from './routes/auth.router'
import { clerkMiddleware } from '@clerk/express'
import { config } from './config/config'

const app = express()

dotenv.config()

const allowedOrigins = [
    'http://localhost:3000',
    // config.FRONTEND_URL,
];

app.use(clerkMiddleware())
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))
app.use(express.json())
app.use(urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Backend is running',
    })
})

app.use('/auth', authRouter)

export default app

