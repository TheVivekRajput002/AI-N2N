import express from 'express'
import {kuch, markWelcomeSeen} from '../controllers/auth.controller'
const router = express.Router()

router.get('/hi', (req,res)=>{
    res.status(200).json({
        message:'backend is running'
    })
})

router.get('/', kuch)
router.post('/welcome-seen', markWelcomeSeen)

export default router