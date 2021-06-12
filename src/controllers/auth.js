const { User } = require('../models')
const { hash } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { SECRET } = require('../constants')

//register
exports.register = async (req, res) => {
  const { email, password } = req.body
  try {
    const hashedPassword = await hash(password, 10)

    await User.create({ email, password: hashedPassword })

    return res.status(201).json({
      success: true,
      message:
        'The registration was succefull, you may logoin with your credentials',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

//login
exports.login = async (req, res) => {
  const { id, email, role } = req.user
  const payload = { id, email, role }

  try {
    const token = await sign(payload, SECRET)

    return res
      .status(200)
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      })
      .json({ success: true, user: payload })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

//logout
exports.logout = async (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie('token', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      })
      .json({
        success: true,
        message: 'Logout was succefull',
        user: null,
      })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.getUsers = async (req, res) => {
  try {
    let { limit, page } = req.query
    page = Number(page) || 1
    limit = Number(limit) || 5
    let offset = page * limit - limit

    const users = await User.findAndCountAll({ limit, offset })

    return res.status(200).json({
      users,
      success: true,
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}
