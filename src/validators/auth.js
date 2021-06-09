const { check } = require('express-validator')
const { User } = require('../models')
const { compare } = require('bcryptjs')

//password
const password = check('password')
  .isLength({ min: 6, max: 15 })
  .withMessage('Password has to be between 6 and 15 characters.')

//email
const email = check('email')
  .isEmail()
  .withMessage('Please provide a valid email')

//check if email exists
const emailExists = check('email').custom(async (value) => {
  const user = await User.findOne({ where: { email: value } })

  if (user) {
    throw new Error('The email already exists, please choose a diffrent one.')
  }
})

//check if email and password are correct
const currectEmailAndPassowrd = check('email').custom(
  async (value, { req }) => {
    const user = await User.findOne({ where: { email: value } })
    if (!user) {
      throw new Error('No user with such email.')
    }

    const currectPassword = await compare(
      req.body.password,
      user.dataValues.password
    )

    if (!currectPassword) {
      throw new Error('Wrong credentials.')
    }

    //pass the user as req.user
    req.user = user.dataValues
  }
)

module.exports = {
  registerValidation: [email, password, emailExists],
  loginValidation: [email, password, currectEmailAndPassowrd],
}
