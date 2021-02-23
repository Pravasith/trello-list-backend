import { handleGET, handlePOST } from './../lib/hitAPIs'
import { ITrelloBoard, ITrelloList } from './interfaces'
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

    let pravasBoardExists = false, pravasBoard: ITrelloBoard[] = []

    await handleGET(
        `https://api.trello.com/1/members/me/boards?key=${ trelloKey }&token=${ trelloToken }`,
        {
            method: 'get'
        }
    )
    .then(res => {
        responseData.trelloBoards = res as ITrelloBoard[]
        pravasBoard = responseData.trelloBoards.filter(board => board.name === 'pravas-board')
        pravasBoardExists = pravasBoard.length > 0
    })
    .catch(e => console.error(e))

    if(!pravasBoardExists){
        // CREATE BOARD
        const name = 'pravas-board'
        await handlePOST(
            `https://api.trello.com/1/boards/?key=${trelloKey}&token=${trelloToken}&name=${name}`,
            {
                method: 'post'
            }
        )
        .then(res => {
            pravasBoard = [res as ITrelloBoard]
        })
        .catch(e => console.error(e))

    }

    res.send(
        {
            pravasBoard: pravasBoard[0]
        }
    )
})

router.get(urls.GET_LISTS_IN_BOARD, async (req, res) => {
    const { trelloKey, trelloToken, boardId } = req.query

    const responseData: { listsInPravasBoard: ITrelloList[] } = {
        listsInPravasBoard: []
    }

    await handleGET(
        `https://api.trello.com/1/boards/${boardId}/lists?key=${trelloKey}&token=${trelloToken}`,
        {
            method: 'get'
        }
    )
    .then(res => {
        responseData.listsInPravasBoard = res as ITrelloList[]
    })
    .catch(e => console.error(e))

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
    .catch(e => console.error(e))

    res.send(responseData)
})


export default router