import express from 'express'

const router = express.Router()

// middlewars
const { authCheck, adminCheck } = require('../middlewares/auth')

//controller
import { createOrUpdateUser, currentUser } from '../controllers/auth'

router.post('/create-or-update-user', authCheck, createOrUpdateUser)
router.post('/current-user', authCheck, currentUser)
router.post('/current-admin', authCheck, adminCheck, currentUser)

module.exports = router
