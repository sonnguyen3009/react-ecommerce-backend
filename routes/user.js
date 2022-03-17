import express from 'express'

const router = express.Router()

// middlewars
const { authCheck } = require('../middlewares/auth')

//controllers
const {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
  applyCouponToUserCart,
  createOrder,
  orders,
  addToWishlist,
  wishlist,
  removeFromWishlist,
  createCashOrder,
} = require('../controllers/user')

router.post('/user/cart', authCheck, userCart)
router.get('/user/cart', authCheck, getUserCart)
router.delete('/user/cart', authCheck, emptyCart)
router.post('/user/address', authCheck, saveAddress)

router.post('/user/order', authCheck, createOrder)
router.post('/user/cash-order', authCheck, createCashOrder) //cash on delivery
router.get('/user/orders', authCheck, orders)

//coupon
router.post('/user/cart/coupon', authCheck, applyCouponToUserCart)

//wishlist
router.post('/user/wishlist', authCheck, addToWishlist)
router.get('/user/wishlist', authCheck, wishlist)
router.put('/user/wishlist/:productId', authCheck, removeFromWishlist)

module.exports = router
