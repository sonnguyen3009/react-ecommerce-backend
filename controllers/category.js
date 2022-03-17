import Category from '../models/category'
import Sub from '../models/sub'
import slugify from 'slugify'
import Product from '../models/product'

export const create = async (req, res) => {
  try {
    const { name } = req.body
    const category = await new Category({ name, slug: slugify(name) }).save()
    res.json(category)
  } catch (err) {
    console.log(err)
    res.status(400).send('Create category failed')
  }
}

export const list = async (req, res) => {
  res.json(await Category.find({}).sort({ createdAt: -1 }).exec())
}

export const read = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).exec()

  const products = await Product.find({ category }).populate('category').exec()
  res.json({ category, products })
}

export const update = async (req, res) => {
  const { name } = req.body
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true },
    )
    res.json(updated)
  } catch (err) {
    console.log(err)
    res.status(400).send('Update category failed')
  }
}

export const remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug })
    res.json(deleted)
  } catch (err) {
    console.log(err)
    res.status(400).send('Delete category failed')
  }
}

export const getSubs = async (req, res) => {
  Sub.find({ parent: req.params._id }).exec((err, subs) => {
    if (err) console.log(err)
    res.json(subs)
  })
}
