require('dotenv').config();

module.exports = {
    secretKey: process.env.TOKEN_SECRET_KEY,
    expiresIn: '1h', 
    refreshExpiresIn: '1d'
  };
  
