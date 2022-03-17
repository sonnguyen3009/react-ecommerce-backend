import express from 'express'
const router = express.Router()

// middlewars
const { authCheck, adminCheck } = require('../middlewares/auth')

//controller
import { upload, remove } from '../controllers/cloudinary'
router.post('/uploadimages', authCheck, adminCheck, upload)
router.post('/removeimage', authCheck, adminCheck, remove)

module.exports = router
