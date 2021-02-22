import { Router } from 'express'
import dotenv from 'dotenv'

import urls from './urls'
import fetchData from '../lib/hitAPIs'

dotenv.config()

const router = Router()

// router.get('/', (req, res) => {
//     req
//     res.send({
//         hello: process.env.PRAVAS_TRELLO_KEY
//     })
// })


router.get(urls.GET_TRELLO_BOARD, async (req, res) => {

    const { trelloKey, trelloToken } = req.query

    await fetchData(
        `https://api.trello.com/1/members/me/boards?key=${ trelloKey }&token=${ trelloToken }`,
        {
            method: 'get'
        }
    )
    .then((res: any) => {
        console.log(res)
        // return res.text()
    })

    // console.log(req.body)
    res.send({
        // ...req.body,
        hello: 'pravas'
    })
})


export default router