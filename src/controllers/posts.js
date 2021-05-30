const { Post } = require('../models')

exports.createPost = async (req, res) => {
  let userId = req.user.id

  try {
    await Post.create({ ...req.body, userId })

    return res.status(201).json({ success: true, message: 'הפוסט נוצר בהצלחה' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getPosts = async (req, res) => {
  let { page, limit } = req.query
  page = Number(page) || 1
  limit = Number(limit) || 10
  let offset = page * limit - limit

  try {
    const posts = await Post.findAndCountAll({ limit, offset })

    return res.status(200).json({ success: true, posts })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}
