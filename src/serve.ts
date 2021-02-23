import cors from "cors"
import express from "express"
// import bodyParser from "body-parser"

import Routes from './routes'

const app = express()
const port = 8000 // default port to listen


const corsOptions = {
    origin: ['http://localhost:3000', 'https://trello-list-frontend-pravas.vercel.app'],
    // origin: ['https://spotifinder.vercel.app'], 

    credentials: true, // <-- REQUIRED backend setting
}

app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use(bodyParser)
app.use('/', Routes)

// start the Express server
app.listen(process.env.PORT ?? port, () => {
    console.log(`server started at http://localhost:${port}`)
})