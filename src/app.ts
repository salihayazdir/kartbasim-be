import express from 'express'
import config from 'config'

const port = config.get<number>('dev.port')
const app = express()

app.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
})