import mongoose from 'mongoose'

const { Schema } = mongoose

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: 'Name is required',
      minlength: [3, 'Too short'],
      maxlength: [32, 'Too long'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Category', categorySchema)
