import express from 'express'
import { getWorkflows, createWorkflow, deleteWorkflow } from '../controllers/workflow.controller'

const router = express.Router()

router.get('/:workspaceId', getWorkflows)
router.post('/:workspaceId', createWorkflow)
router.delete('/:workflowId', deleteWorkflow)

export default router