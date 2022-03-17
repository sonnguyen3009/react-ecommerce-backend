import User from '../models/user'
import Cart from '../models/cart'
import Product from '../models/product'
import Coupon from '../models/coupon'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET)

export const createPaymentIntent = async (req, res) => {
  const { couponApplied } = req.body
  const user = await User.findOne({ email: req.user.email }).exec()
  const { cartTotal, totalAfterDiscount } = await Cart.findOne({
    orderdBy: user._id,
  }).exec()

  let finalAmount = 0

  if (couponApplied && totalAfterDiscount) {
    finalAmount = Math.round(totalAfterDiscount * 100)
  } else {
    finalAmount = Math.round(cartTotal * 100)
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: 'usd',
  })

  res.send({
    clientSecret: paymentIntent.client_secret,
    cartTotal,
    totalAfterDiscount,
    payable: finalAmount,
  })
}
