import app from './src/app'
import { config } from './src/config/config'

app.listen(config.PORT, () => {
    console.log(`server running on port ${config.PORT}`)
})