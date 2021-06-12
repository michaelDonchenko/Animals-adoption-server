const { Sequelize } = require('sequelize')

// module.exports = new Sequelize('animals_adoption', 'postgres', 'root', {
//   dialect: 'postgres',
//   host: 'localhost',
//   port: '5432',
// })

module.exports = new Sequelize(process.env.DB_CONNECTION_STRING)
