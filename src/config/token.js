require('dotenv').config();

module.exports = {
    secretKey: process.env.TOKEN_SECRET_KEY,
    expiresIn: '7d', 
    refreshExpiresIn: '7d'
  };
  
