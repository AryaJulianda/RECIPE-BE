require('dotenv').config();

module.exports = {
    email: process.env.EMAIL_TESTER_ADDRESS,
    password: process.env.EMAIL_TESTER_PASSWORD,
    host:process.env.EMAIL_TESTER_HOST,
    port:process.env.EMAIL_TESTER_PORT,
    apiKey:process.env.EMAIL_API_KEY
  };
  
