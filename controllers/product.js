import Product from '../models/product'
import User from '../models/user'
import slugify from 'slugify'

export const create = async (req, res) => {
  try {
    console.log(req.body)
    req.body.slug = slugify(req.body.title)
    const newProduct = await new Product(req.body).save()
    res.json(newProduct)
  } catch (err) {
    console.log(err)
    // res.status(400).send('Create product failed')
    res.status(400).json({
      err: err.message,
    })
  }
}

export const listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate('category')
    .populate('subs')
    .sort([['createdAt', 'desc']])
    .exec()
  res.json(products)
}

export const remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec()
    res.json(deleted)
  } catch (error) {
    console.log(error)
    return res.status(400).send('Product delete failed')
  }
}

export const read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category')
    .populate('subs')
    .exec()
  res.json(product)
}

export const update = async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true },
    ).exec()
    res.json(updated)
  } catch (err) {
    console.log('PRODUCT UPDATE ERROR ->', err)
    res.status(400).json({
      err: err.message,
    })
  }
}

// export const list = async (req, res) => {
//   try {
//     //{createdAt/updatedAt}, {desc, asc}, limit
//     const { sort, order, limit } = req.body
//     const products = await Product.find({})
//       .populate('category')
//       .populate('subs')
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec()

//     res.json(products)
//   } catch (err) {
//     console.log(err)
//   }
// }

export const list = async (req, res) => {
  try {
    //{createdAt/updatedAt}, {desc, asc}, limit
    const { sort, order, page } = req.body
    const currentPage = page || 1
    const perPage = 3

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate('category')
      .populate('subs')
      .sort([[sort, order]])
      .limit(perPage)
      .exec()

    res.json(products)
  } catch (err) {
    console.log(err)
  }
}

export const productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec()
  res.json(total)
}

export const productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec()
  const user = await User.findOne({ email: req.user.email }).exec()
  const { star } = req.body
  console.log('STAR => ', star)

  //who is updating?
  //check if currently logged in user have already added rating to this product?
  let existingRatingObject = product.ratings.find(
    (ele) => ele.postedBy.toString() === user._id.toString(),
  )

  //if user haven't left rating yet, push it
  if (existingRatingObject === undefined) {
    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star: star, postedBy: user._id } },
      },
      { new: true },
    ).exec()
    console.log('ratingAdded', ratingAdded)
    res.json(ratingAdded)
  } else {
    // if user have already left rating, update it
    const ratingUpdated = await Product.updateOne(
      {
        ratings: { $elemMatch: existingRatingObject },
      },
      { $set: { 'ratings.$.star': star } },
      { new: true },
    ).exec()
    console.log('ratingUpdated', ratingUpdated)
    res.json(ratingUpdated)
  }
}

export const listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec()

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate('category')
    .populate('subs')
    .populate({
      path: 'ratings.postedBy',
    })
    .exec()

  res.json(related)
}

//Search / Filters

const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .exec()

  res.json(products)
}

const handlePrice = async (req, res, price) => {
  try {
    const products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .exec()

    res.json(products)
  } catch (error) {
    console.log(error)
  }
}

const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .exec()

    res.json(products)
  } catch (error) {
    console.log(error)
  }
}

const handleStar = async (req, res, stars) => {
  Product.aggregate([
    {
      $project: {
        document: '$$ROOT',
        floorAverage: {
          $floor: { $avg: '$ratings.star' },
        },
      },
    },
    { $match: { floorAverage: stars } },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log('AGGREGATE ERROR', err)
      Product.find({ _id: aggregates })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .exec((err, products) => {
          if (err) console.log('PRODUCT AGGREGATE ERROR', err)
          res.json(products)
        })
    })
}

const handleSub = async (req, res, sub) => {
  const products = await Product.find({ subs: sub })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .exec()

  res.json(products)
}

const handleShipping = async (req, res, shipping) => {
  const products = await Product.find({ shipping })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .exec()

  res.json(products)
}

const handleColor = async (req, res, color) => {
  const products = await Product.find({ color })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .exec()

  res.json(products)
}

const handleBrand = async (req, res, brand) => {
  const products = await Product.find({ brand })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .exec()

  res.json(products)
}

export const searchFilters = async (req, res) => {
  const {
    query,
    price,
    category,
    stars,
    sub,
    shipping,
    color,
    brand,
  } = req.body

  if (query) {
    await handleQuery(req, res, query)
  }

  if (price !== undefined) {
    await handlePrice(req, res, price)
  }

  if (category) {
    console.log('category--->', category)
    await handleCategory(req, res, category)
  }

  if (stars) {
    console.log('Stars--->', stars)
    await handleStar(req, res, stars)
  }

  if (sub) {
    console.log('Sub--->', sub)
    await handleSub(req, res, sub)
  }

  if (shipping) {
    console.log('Shipping--->', shipping)
    await handleShipping(req, res, shipping)
  }

  if (color) {
    console.log('Color--->', color)
    await handleColor(req, res, color)
  }

  if (brand) {
    console.log('Brand--->', brand)
    await handleBrand(req, res, brand)
  }
}
