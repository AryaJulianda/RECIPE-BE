const jwt = require('jsonwebtoken');
const configToken = require('../config/token');

const gerateNewAccessToken = (refreshToken) => {
  try {
    // Verify refresh token
    const decodedRefreshToken = jwt.verify(refreshToken, config.refreshSecretKey);

    // Generate new access token
    const newAccessToken = jwt.sign({ id: decodedRefreshToken.id, role: decodedRefreshToken.role }, config.secretKey, { expiresIn: config.expiresIn });

    return newAccessToken;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};


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
     if (error.name === 'TokenExpiredError') {
      try {
        const newAccessToken = gerateNewAccessToken(req.body.refreshToken);
        req.userId = newAccessToken.id;
        req.role = newAccessToken.role;
        next();
      } catch (refreshError) {
        return res.status(401).json({ success: false, message: 'Token kedaluwarsa' });
      } 
  } else {
    return res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
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