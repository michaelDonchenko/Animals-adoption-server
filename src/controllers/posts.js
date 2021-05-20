const db = require('../db')

exports.createPost = async (req, res) => {
  const {
    animal_type,
    post_location,
    animal_name,
    age,
    birth_date,
    animal_gender,
    animal_size,
    color,
    immune,
    sterilized_or_castrated,
  } = req.body

  try {
    const { rows: post } = await db.query(
      'INSERT INTO posts(user_id) VALUES ($1) RETURNING *',
      [req.user.id]
    )

    const newAnimal =
      'INSERT INTO animals(post_id, animal_type, post_location, animal_name, age, birth_date, animal_gender, animal_size, color, immune, sterilized_or_castrated) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *'

    const { id: postId } = post[0]

    const { rows: animal } = await db.query(newAnimal, [
      postId,
      animal_type,
      post_location,
      animal_name,
      age,
      birth_date,
      animal_gender,
      animal_size,
      color,
      immune,
      sterilized_or_castrated,
    ])

    return res.status(201).json({ success: true, animal })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.getPosts = async (req, res) => {
  try {
    const { rows } = await db.query(
      'select * from  posts, animals where animals.post_id = posts.id'
    )
    return res.json(rows)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}
