import mongoose from 'mongoose'

const { Schema } = mongoose
const { ObjectId } = Schema

const couponSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      uppercase: true,
      required: 'Name is required',
      minlength: [6, 'Two short'],
      maxlength: [12, 'Two long'],
    },
    expiry: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Coupon', couponSchema)
