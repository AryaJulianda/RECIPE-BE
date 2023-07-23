const jwt = require('jsonwebtoken');
const configToken = require('../config/token');


exports.authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(403).json({ success: false, message: 'Token tidak ada, otorisasi ditolak' });
  }

  try {
    // Verifikasi token JWT
    const decoded = jwt.verify(token, configToken.secretKey);
    req.userId = decoded.id; // Menyimpan ID user ke objek req untuk digunakan di controller lain
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
};
