import express from 'express'
import { getTemplates, createTemplate, submitTemplateFromWorkflow } from '../controllers/template.controller'

const router = express.Router()

router.get('/', getTemplates)
router.post('/', createTemplate)
router.post('/submit', submitTemplateFromWorkflow)

export default router
