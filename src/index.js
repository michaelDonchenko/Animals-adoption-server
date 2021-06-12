const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { PORT, CLIENT_URL } = require('./constants')
const passport = require('passport')
const sequelize = require('./db')

//import passport middleware
require('./middlewares/passport-middleware')

//init middlewares
app.use(express.json({ limit: '10mb' }))
app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(cookieParser())
app.use(passport.initialize())

//import routes
const authRoutes = require('./routes/auth')
const postsRoutes = require('./routes/posts')
const cloudinaryRoutes = require('./routes/cloudinary')

//use routes
app.use('/api', authRoutes)
app.use('/api', postsRoutes)
app.use('/api', cloudinaryRoutes)

//app start
const appStart = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`The app is running at http://localhost:${PORT}`)
    })
    //database connection
    try {
      await sequelize.authenticate()
      await sequelize.sync()
      console.log('Connection has been established successfully.')
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log(`Error: ${error.message}`)
  }
}

appStart()
