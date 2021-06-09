const cloudinary = require('cloudinary')
const {
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require('../constants')
const { Image } = require('../models')

//cloudinary config
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

//upload image
exports.uploadImages = async (req, res) => {
  let { image, postId } = req.body

  if (!image) {
    return res
      .status(400)
      .json({ message: 'Please choose an image to upload', success: false })
  }

  try {
    cloudinary.v2.uploader.upload(
      image,
      { folder: 'animals-adoption' },
      async (error, result) => {
        if (error) {
          return res.status(400).json({
            success: false,
            message: 'Could not upload the images.',
          })
        }

        let { public_id, secure_url } = result

        let newImage = await Image.create({
          url: secure_url,
          postId,
          publicId: public_id,
        })

        if (!newImage) {
          return res.status(400).json({
            message: 'Could not upload the images.',
          })
        }

        return res.status(201).json({
          success: true,
          message: 'Image was uploaded succefully',
        })
      }
    )
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}
