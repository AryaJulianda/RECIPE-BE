const jwt = require('jsonwebtoken');
const configToken = require('../config/token');

exports.tokenVerification = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  //if wanna get from cookie
  // const token = req.cookies.jwt;

  // console.log('ini token',token);

  if (!token) {
    console.log('mana tokennya?',token);
    return res.status(403).json({ success: false, message: 'Token tidak ada, otorisasi ditolak' });
  }

  try {
    // Verifikasi token JWT
    const decoded = jwt.verify(token, configToken.secretKey);
    // console.log(`User dengan id ${decoded.id} dan role ${decoded.role} sedang menggunakan aplikasi`);
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
};

exports.validateRole = (role) => {
  return (req, res, next) => {
    const userRole = req.role;
    if (userRole !== role) {
      return res.status(403).json({ message: "Tidak diizinkan mengakses halaman ini." });
    } else {
      next();
      return res.status(200).json({ message: "Anda sedang berada di halaman admin" });
    }
    
  };
}