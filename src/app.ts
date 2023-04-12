import express from 'express'
import config from 'config'
import { getBanks } from './database/storedProcs'
import logger from './utils/logger'
import routes from './routes'
 
const port = config.get<number>('dev.port')
const app = express()

app.listen(port, () => {
    logger.info(`Listening on localhost:${port}`);
    routes(app)
})

getBanks()