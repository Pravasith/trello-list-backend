import { handleGET, handlePOST } from './../lib/hitAPIs'
import { ITrelloBoard } from './interfaces'
import { Router } from 'express'
import dotenv from 'dotenv'

import urls from './urls'

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

    const responseData: { trelloBoards: ITrelloBoard[] } = {
        trelloBoards: []
    }

    await handleGET(
        `https://api.trello.com/1/members/me/boards?key=${ trelloKey }&token=${ trelloToken }`,
        {
            method: 'get'
        }
    )
    .then((res) => {
        responseData.trelloBoards = res as ITrelloBoard[]
    })

    res.send(responseData)
})


router.post(urls.CREATE_TRELLO_BOARD, async (req, res) => {
    const { trelloKey, trelloToken, name } = req.query


    const responseData: { trelloBoard: ITrelloBoard } | {} = {}

    await handlePOST(
        `https://api.trello.com/1/boards/?key=${ trelloKey }&token=${ trelloToken }&name=${ name }`,
        {
            method: 'post'
        }
    )
    .then(res => {
        (responseData as { trelloBoard: ITrelloBoard }).trelloBoard = (res as ITrelloBoard)
    })


    res.send(responseData)
})


export default router