import express from 'express'
import { getWorkflows, createWorkflow} from '../controllers/workflow.controller'

const router = express.Router()

router.get('/:workspaceId', getWorkflows)
router.post('/:workspaceId', createWorkflow)

export default router