import express from 'express'
import { getTemplates, createTemplate } from '../controllers/template.controller'

const router = express.Router()

router.get('/', getTemplates)
router.post('/', createTemplate)

export default router
