import express from 'express'

const router = express.Router()

// middlewars
const { authCheck, adminCheck } = require('../middlewares/auth')

//controller
import { create, read, update, remove, list } from '../controllers/sub'

//routes
router.post('/sub', authCheck, adminCheck, create)
router.get('/subs', list)
router.get('/sub/:slug', read)
router.put('/sub/:slug', authCheck, adminCheck, update)
router.delete('/sub/:slug', authCheck, adminCheck, remove)

module.exports = router
