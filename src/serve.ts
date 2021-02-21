import express from "express"

import Routes from './routes'

const app = express()
const port = 8000 // default port to listen


app.use(
    '/', Routes
)

// start the Express server
app.listen(process.env.PORT || port, () => {
    console.log(`server started at http://localhost:${port}`)
})