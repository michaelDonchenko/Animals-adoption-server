const { Router } = require('express')
const { register, login, logout } = require('../controllers/auth')
const { userAuth } = require('../middlewares/auth-middleware')
const { validationMiddleware } = require('../middlewares/express-validator')
const { registerValidation, loginValidation } = require('../validators/auth')
const router = Router()

router.post('/register', registerValidation, validationMiddleware, register)
router.post('/login', loginValidation, validationMiddleware, login)
router.post('/logout', userAuth, logout)

module.exports = router
