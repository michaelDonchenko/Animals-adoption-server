const { Router } = require('express')
const { createPost, getPosts } = require('../controllers/posts')
const { userAuth } = require('../middlewares/auth-middleware')

const router = Router()

router.post('/create-post', userAuth, createPost)
router.get('/posts', getPosts)

module.exports = router
