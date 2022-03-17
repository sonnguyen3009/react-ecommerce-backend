import express from 'express'

const router = express.Router()

// middlewars
const { authCheck, adminCheck } = require('../middlewares/auth')

//controllers
const { orders, orderStatus } = require('../controllers/admin')

router.put('/admin/order-status', authCheck, adminCheck, orderStatus)
router.get('/admin/orders', authCheck, adminCheck, orders)

module.exports = router
