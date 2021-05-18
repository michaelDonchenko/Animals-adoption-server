const { check } = require('express-validator')
const db = require('../db')
const { compare } = require('bcryptjs')

//password
const password = check('password')
  .isLength({ min: 8, max: 15 })
  .withMessage('הסיסמה צריכה להיות בין 8 ל15 תווים.')

//email
const email = check('email')
  .isEmail()
  .withMessage('אנה הכנס כתובת אימייל תקינה.')

//check if email exists
const emailExists = check('email').custom(async (value) => {
  const { rows } = await db.query('SELECT * from users WHERE email = $1', [
    value,
  ])

  if (rows.length) {
    throw new Error('האימייל כבר קיים במערכת.')
  }
})

//check if email and password are correct
const currectEmailAndPassowrd = check('email').custom(
  async (value, { req }) => {
    const { rows } = await db.query('SELECT * from users WHERE email = $1', [
      value,
    ])

    if (!rows.length) {
      throw new Error('האימייל לא קיים במערכת, נסה שנית')
    }

    req.user = rows[0]

    const currectPassword = await compare(req.body.password, req.user.password)

    if (!currectPassword) {
      throw new Error('הסיסמה שגוייה.')
    }
  }
)

module.exports = {
  registerValidation: [email, password, emailExists],
  loginValidation: [email, password, currectEmailAndPassowrd],
}
