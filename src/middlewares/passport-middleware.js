const passport = require('passport')
const { Strategy } = require('passport-jwt')
const { SECRET } = require('../constants')
const { User } = require('../models')

const cookieExtractor = function (req) {
  let token = null
  if (req && req.cookies) token = req.cookies['token']
  return token
}

const opts = {
  secretOrKey: SECRET,
  jwtFromRequest: cookieExtractor,
}

passport.use(
  new Strategy(opts, async ({ id }, done) => {
    try {
      const user = await User.findOne({ where: { id } })

      return await done(null, user)
    } catch (error) {
      console.log(error.message)
      done(null, false)
    }
  })
)
