const { Router } = require('express')
const { uploadImages } = require('../controllers/cloudinary')
const { userAuth } = require('../middlewares/auth-middleware')
const router = Router()

router.post('/upload-images', userAuth, uploadImages)

module.exports = router
