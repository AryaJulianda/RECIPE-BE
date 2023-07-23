require('dotenv').config();

module.exports = {
    secretKey: process.env.TOKEN_SECRET_KEY,
    expiresIn: '1h', // Durasi token berlaku (1 jam dalam contoh ini)
  };
  
