const { Post, Image } = require('../models')
const { Op } = require('sequelize')
const cloudinary = require('cloudinary')
const {
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require('../constants')

//cloudinary config
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

exports.createPost = async (req, res) => {
  let userId = req.user.id

  try {
    const post = await Post.create({ ...req.body, userId })

    return res
      .status(201)
      .json({ success: true, message: 'Post created succefully', post })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getPosts = async (req, res) => {
  let { page, limit, type, gender, adopted, location, size, age, order } =
    req.query
  page = Number(page) || 1
  limit = Number(limit) || 10
  let offset = page * limit - limit

  let orderQuery = ['createdAt', 'DESC']

  if (order) {
    order === 'createdAt desc'
      ? (orderQuery = ['createdAt', 'DESC'])
      : order === 'createdAt asc'
      ? (orderQuery = ['createdAt', 'ASC'])
      : order === 'age desc'
      ? (orderQuery = ['age', 'DESC'])
      : order === 'age asc'
      ? (orderQuery = ['age', 'ASC'])
      : order === 'name asc'
      ? (orderQuery = ['name', 'ASC'])
      : (orderQuery = ['createdAt', 'DESC'])
  }

  let queryOBJ = {
    type: type ? type : ['cat', 'dog'],
    gender: gender ? gender : ['male', 'female'],
    adopted: adopted ? adopted : [true, false],
    location: location ? location : ['north', 'center', 'south'],
    size: size ? size : ['small', 'medium', 'large'],
    age:
      age == 0
        ? { [Op.lt]: 1 }
        : age == 1
        ? { [Op.eq]: 1 }
        : age == 2
        ? { [Op.eq]: 2 }
        : age == 3
        ? { [Op.eq]: 3 }
        : age == 4
        ? { [Op.gte]: 4 }
        : { [Op.gte]: 0 },
  }

  try {
    const posts = await Post.findAndCountAll({
      order: [orderQuery],
      limit,
      offset,
      include: Image,
      attributes: ['id', 'name', 'age', 'gender', 'createdAt'],
      where: queryOBJ,
    })

    let pages = Math.ceil(posts.count / limit)

    return res.status(200).json({ success: true, posts, pages })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.getPostsByUser = async (req, res) => {
  let { page, limit } = req.query
  let user = req.user

  page = Number(page) || 1
  limit = Number(limit) || 10
  let offset = page * limit - limit

  try {
    const posts = await Post.findAndCountAll({
      order: [['createdAt', 'DESC']],
      attributes: ['createdAt', 'name', 'id'],
      where: { userId: user.id },
      limit,
      offset,
    })

    let pages = Math.ceil(posts.count / limit)

    return res.status(200).json({ success: true, posts, pages })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.getPost = async (req, res) => {
  const { postId } = req.params

  try {
    const post = await Post.findByPk(postId, { include: Image })

    return res.status(200).json({ success: true, post })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.updatePost = async (req, res) => {
  let { id } = req.query

  try {
    const post = await Post.update(
      { ...req.body },
      {
        where: {
          id,
        },
      }
    )

    return res
      .status(201)
      .json({ success: true, message: 'Post updated succefully' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.deletePost = async (req, res) => {
  const { postId } = req.params

  try {
    const images = await Image.findAll({
      where: {
        postId,
      },
    })

    let urls = []

    images.map((img) => urls.push(img.dataValues.publicId))

    if (urls.length > 0) {
      for (let i = 0; i < urls.length; i++) {
        cloudinary.uploader.destroy(urls[i], async ({ result }) => {
          if (result !== 'ok') {
            return res
              .status(400)
              .json({ message: 'Error could not delete the post' })
          }
        })
      }
    }

    await Image.destroy({
      where: {
        postId,
      },
    })

    await Post.destroy({
      where: {
        id: postId,
      },
    })

    return res
      .status(200)
      .json({ success: true, message: 'Post deleted succefully' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}
