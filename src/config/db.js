// Configuration to PostgreSQL
const { Pool } = require('pg');

const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT;
const dbHost = process.env.DB_HOST;
const dbDatabase = process.env.DB_DATABASE;

const pool = new Pool({
  user: dbUsername,
  host: dbHost,
  database: dbDatabase,
  password: dbPassword,
  port: dbPort,
});

module.exports = pool;
