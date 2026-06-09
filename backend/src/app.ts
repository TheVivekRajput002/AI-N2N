import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRouter from './routes/auth.router'
import workflowRouter from './routes/workflow.router'
import workspaceRouter from './routes/workspace.router'
import { clerkMiddleware } from '@clerk/express'
import workflowVersionRouter from './routes/workflowVersion.router'
import executionRouter from './routes/execution.router'
import { config } from './config/config'

const app = express()

dotenv.config()

const allowedOrigins = [
    'http://localhost:3000',
    'https://ai-n2n.vercel.app',
];

if (config.FRONTEND_URL) {
    allowedOrigins.push(config.FRONTEND_URL);
}

app.use(clerkMiddleware())
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);
        
        const isAllowed = allowedOrigins.includes(origin) || 
                          origin.endsWith('.vercel.app');
                          
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))
app.use(express.json())
app.use(urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Backend is running',
    })
})

app.post('/', (req,res) => {
    console.log(req.body)
    return res.status(200).json({
        success: true,
        message: "Hello"
    })
})

app.use('/auth', authRouter)
app.use('/workspaces', workspaceRouter)
app.use('/workflows', workflowRouter)
app.use('/workflow-version', workflowVersionRouter)
app.use('/executions', executionRouter)

export default app


