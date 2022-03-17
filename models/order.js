import mongoose from 'mongoose'

const { Schema } = mongoose
const { ObjectId } = Schema

const orderSchema = new Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: 'Product',
        },
        count: Number,
        color: String,
      },
    ],
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: 'Not Processed',
      enum: [
        'Not Processed',
        'Cash On Delivery',
        'Processing',
        'Dispatched',
        'Cancelled',
        'Completed',
      ],
    },
    orderdBy: { type: ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

export default mongoose.model('Order', orderSchema)
