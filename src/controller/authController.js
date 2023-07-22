// controllers/authController.js
const jwt = require('jsonwebtoken');
const config = require('../config/token');
const authModel = require('../model/authModel')

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if(!email) throw new Error('email is required');
    if(!password) throw new Error('password is required')
    
    const user = await authModel.login(email, password);

    // Buat token JWT
    const token = jwt.sign({ id: user.user_id }, config.secretKey, { expiresIn: config.expiresIn });
    res.json({ success: true, message: 'Login berhasil', token });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    console.log(req.body)
    try {
      // Lakukan registrasi ke database menggunakan model
      const newUser = await authModel.register(username, email, password);
  
      res.json({ success: true, message: 'Registrasi berhasil', user: newUser });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

