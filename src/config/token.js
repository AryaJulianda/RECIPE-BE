require('dotenv').config();

module.exports = {
    secretKey: process.env.TOKEN_SECRET_KEY,
    refreshSecretKey: process.env.REFRESH_SECRET_KEY,
    activationSecretKey: process.env.ACTIVATION_SECRET_KEY,
    expiresIn: '7d', 
    refreshExpiresIn: '1w'
  };
  
