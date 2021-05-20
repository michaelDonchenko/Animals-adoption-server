const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'animals_adoption',
  password: 'Mr100michael',
  port: 5432,
})

module.exports = {
  query: (text, params) => pool.query(text, params),
}
