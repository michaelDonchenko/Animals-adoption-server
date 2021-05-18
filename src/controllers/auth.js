const db = require('../db')
const { hash } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { SECRET } = require('../constants')

//register
exports.register = async (req, res) => {
  const { email, password } = req.body
  try {
    const hashedPassword = await hash(password, 10)

    await db.query(
      'INSERT INTO users(email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    )

    return res.status(201).json({
      success: true,
      message: 'ההרשמה בוצעה בהצלחה, כעט ניתן להתחבר לאתר עם האימייל והסיסמה.',
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
  const { id, email } = req.user
  const payload = { id, email }

  try {
    const token = await sign(payload, SECRET)

    return res
      .status(200)
      .cookie('token', token, { httpOnly: true })
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
      })
      .json({
        success: true,
        message: 'ההתנתקות בוצעה בהצלחה.',
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
