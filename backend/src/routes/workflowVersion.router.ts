import express from 'express'
import { createWorkflowVersion } from '../controllers/workflowVersion.controller';

const router = express.Router()

router.post('/', createWorkflowVersion)

export default router