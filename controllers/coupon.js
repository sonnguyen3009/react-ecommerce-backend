import Coupon from '../models/coupon'

export const create = async (req, res) => {
  try {
    const { name, expiry, discount } = req.body
    res.json(await new Coupon({ name, expiry, discount }).save())
  } catch (error) {
    console.log(error)
  }
}

export const remove = async (req, res) => {
  try {
    res.json(await Coupon.findByIdAndDelete(req.params.couponId).exec())
  } catch (error) {
    console.log(error)
  }
}

export const list = async (req, res) => {
  try {
    res.json(await Coupon.find({}).sort({ createdAt: -1 }).exec())
  } catch (error) {
    console.log(error)
  }
}
