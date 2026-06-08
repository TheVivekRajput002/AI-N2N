import express from 'express'
import { getWorkspaces, createWorkspace, deleteWorkspace } from '../controllers/workspace.controller';

const router = express.Router()

router.post('/', createWorkspace)
router.get('/', getWorkspaces)
router.delete('/:id', deleteWorkspace)
// router.post('/:id/workflows')
// router.get('/:id/workflows')
// router.get('/:id/workflows')


export default router