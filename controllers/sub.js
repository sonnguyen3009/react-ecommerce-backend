import Sub from '../models/sub'
import Product from '../models/product'
import slugify from 'slugify'

export const create = async (req, res) => {
  try {
    const { name, parent } = req.body
    const subCategory = await new Sub({
      name,
      parent,
      slug: slugify(name),
    }).save()
    res.json(subCategory)
  } catch (err) {
    console.log(err)
    res.status(400).send('Create Sub failed')
  }
}

export const list = async (req, res) => {
  res.json(await Sub.find({}).sort({ createdAt: -1 }).exec())
}

export const read = async (req, res) => {
  const sub = await Sub.findOne({ slug: req.params.slug }).exec()
  const products = await Product.find({
    subs: sub,
  })
    .populate('category')
    .exec()

  res.json({ sub, products })
}

export const update = async (req, res) => {
  const { name, parent } = req.body
  try {
    const updated = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      { name, parent, slug: slugify(name) },
      { new: true },
    )
    res.json(updated)
  } catch (err) {
    console.log(err)
    res.status(400).send('Update sub failed')
  }
}

export const remove = async (req, res) => {
  try {
    const deleted = await Sub.findOneAndDelete({ slug: req.params.slug })
    res.json(deleted)
  } catch (err) {
    console.log(err)
    res.status(400).send('Delete sub failed')
  }
}
