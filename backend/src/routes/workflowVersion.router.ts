import express from 'express'
import { createWorkflowVersion, getWorkflowVersion, updateWorkflowVersion } from '../controllers/workflowVersion.controller';

const router = express.Router()

router.post('/', createWorkflowVersion)
router.post('/update', updateWorkflowVersion)
router.get('/', getWorkflowVersion)

export default router