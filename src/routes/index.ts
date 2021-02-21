import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
    req
    res.send({
        hello: 'ePilot!'
    })
})


router.get('/pravas', (req, res) => {
    req
    res.send({
        hello: 'pravas'
    })
})


export default router