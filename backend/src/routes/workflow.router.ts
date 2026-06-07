import express from 'express'
import { getWorkflows, createWorkflow} from '../controllers/workflow.controller'

const router = express.Router()

router.get('/:workspaceId', getWorkflows)
router.post('/:workspaceId', createWorkflow)
// router.delete('/:id')
// router.post('/:id/duplicate')

// router.post('/:id/versions')
// router.get('/:id/versions')
// router.get('/:id/versions/:versionId')
// router.post('/:id/rollback/:versionId')

export default router