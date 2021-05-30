const { check } = require('express-validator')
const { User } = require('../models')
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
  const user = await User.findOne({ where: { email: value } })

  if (user) {
    throw new Error('האימייל כבר קיים במערכת.')
  }
})

//check if email and password are correct
const currectEmailAndPassowrd = check('email').custom(
  async (value, { req }) => {
    const { dataValues } = await User.findOne({ where: { email: value } })
    if (!dataValues) {
      throw new Error('האימייל לא קיים במערכת.')
    }

    //set user as dataValues
    const user = dataValues

    const currectPassword = await compare(req.body.password, user.password)

    if (!currectPassword) {
      throw new Error('הסיסמה שגוייה.')
    }

    //pass the user as req.user
    req.user = user
  }
)

module.exports = {
  registerValidation: [email, password, emailExists],
  loginValidation: [email, password, currectEmailAndPassowrd],
}
