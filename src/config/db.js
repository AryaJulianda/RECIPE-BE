const { Pool } = require('pg');
require('dotenv').config();

// const dbUsername = process.env.DB_USERNAME ;
// const dbPassword = process.env.DB_PASSWORD;
// const dbPort = process.env.DB_PORT;
// const dbHost = process.env.DB_HOST;
// const dbDatabase = process.env.DB_DATABASE;

const dbUsername = process.DB_USERNAME;
const dbPassword = process.DB_PASSWORD;
const dbPort = process.DB_PORT;
const dbHost = process.DB_HOST;
const dbDatabase = process.DB_DATABASE;

const pool = new Pool({
  user: dbUsername,
  host: dbHost,
  database: dbDatabase,
  password: dbPassword,
  port: dbPort,
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    console.log(dbUsername,dbHost)
  } else {
    console.log('Connected to the database!');
  }
});

module.exports = pool;

