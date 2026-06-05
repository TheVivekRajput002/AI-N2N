import express, { urlencoded } from 'express'
import dotenv from 'dotenv'

const app = express()

dotenv.config()
app.use(express.json())
app.use(urlencoded({extended:true}))

app.get('/', (req,res) => {
    res.status(200).json({
        message:'Backend is running',
    })
})

app.listen(process.env.PORT || 3000,()=>{
    console.log(`server running on port ${process.env.PORT}`)
})

