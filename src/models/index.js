const sequelize = require('../db')
const { DataTypes, ENUM, BOOLEAN } = require('sequelize')
const { STRING, INTEGER, TEXT } = DataTypes

//user model
const User = sequelize.define('user', {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: STRING, unique: true },
  password: { type: STRING },
  role: { type: STRING, defaultValue: 'USER' },
})

//post model
const Post = sequelize.define('post', {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: STRING, allowNull: false },
  type: { type: ENUM('cat', 'dog'), allowNull: false },
  location: { type: ENUM('north', 'center', 'south'), allowNull: false },
  adopted: { type: BOOLEAN, defaultValue: false },
  age: { type: INTEGER, allowNull: false },
  gender: { type: ENUM('male', 'female'), allowNull: false },
  size: { type: ENUM('small', 'medium', 'large'), allowNull: false },
  color: STRING,
  immune: { type: BOOLEAN, allowNull: false },
  sterilized_or_castrated: { type: BOOLEAN, allowNull: false },
  about: TEXT,
  phone: STRING,
})

//images model
const Image = sequelize.define('image', {
  id: { type: INTEGER, primaryKey: true, autoIncrement: true },
  url: { type: STRING, allowNull: false },
  publicId: { type: STRING, allowNull: false },
})

//relations
User.hasMany(Post)
Post.belongsTo(User)

Post.hasMany(Image)
Image.belongsTo(Post)

module.exports = {
  User,
  Post,
  Image,
}
