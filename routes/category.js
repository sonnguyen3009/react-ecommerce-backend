import express from 'express'

const router = express.Router()

// middlewars
const { authCheck, adminCheck } = require('../middlewares/auth')

//controller
import {
  create,
  read,
  update,
  remove,
  list,
  getSubs,
} from '../controllers/category'

//routes
router.post('/category', authCheck, adminCheck, create)
router.get('/categories', list)
router.get('/category/:slug', read)
router.put('/category/:slug', authCheck, adminCheck, update)
router.delete('/category/:slug', authCheck, adminCheck, remove)
router.get('/category/subs/:_id', getSubs)

module.exports = router
