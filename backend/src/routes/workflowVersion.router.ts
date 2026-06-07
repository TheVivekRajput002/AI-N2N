import express from 'express'
import { createWorkflowVersion, getWorkflowVersion } from '../controllers/workflowVersion.controller';

const router = express.Router()

router.post('/', createWorkflowVersion)
router.get('/', getWorkflowVersion)

export default router