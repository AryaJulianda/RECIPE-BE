// Configuration to PostgreSQL
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'recipe_app',
  password: 'sugiono6969',
  port: 6969,
});

module.exports = pool;
