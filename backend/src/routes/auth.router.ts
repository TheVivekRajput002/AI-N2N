import express from 'express'
import authController from '../controllers/auth.controller'
const router = express.Router()

router.get('/hi', (req,res)=>{
    res.status(200).json({
        message:'backend is running'
    })
})

router.get('/', authController.kuch)

export default router