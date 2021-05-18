const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { PORT } = require('./constants')
const passport = require('passport')

//import passport middleware
require('./middlewares/passport-middleware')

//init middlewares
app.use(express.json({ limit: '5mb' }))
app.use(cors())
app.use(cookieParser())
app.use(passport.initialize())

//import routes
const authRoutes = require('./routes/auth')

//use routes
app.use('/api', authRoutes)

//app start
const appStart = () => {
  try {
    app.listen(PORT, () => {
      console.log(`The app is running at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.log(`Error: ${error.message}`)
  }
}

appStart()
