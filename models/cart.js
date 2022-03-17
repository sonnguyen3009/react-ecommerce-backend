import mongoose from 'mongoose'

const { Schema } = mongoose
const { ObjectId } = Schema

const cartSchema = new Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: 'Product',
        },
        count: Number,
        color: String,
        price: Number,
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderdBy: { type: ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

export default mongoose.model('Cart', cartSchema)
