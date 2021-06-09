const { Router } = require('express')
const {
  createPost,
  getPosts,
  getPostsByUser,
  getPost,
  updatePost,
} = require('../controllers/posts')
const { userAuth } = require('../middlewares/auth-middleware')

const router = Router()

router.post('/create-post', userAuth, createPost)
router.get('/posts', getPosts)
router.put('/update-post', userAuth, updatePost)
router.get('/posts-by-user', userAuth, getPostsByUser)
router.get('/post/:postId', getPost)

module.exports = router
