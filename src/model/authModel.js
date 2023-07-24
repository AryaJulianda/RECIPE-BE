// models/authModel.js
const argon2 = require('argon2');
const pool = require('../config/db');

exports.login = async (email, password) => {
  try {
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    const result = await pool.query(query);

    if (result.rowCount > 0) {
      const user = result.rows[0];
      // Verifikasi password dengan argon2
      if (await argon2.verify(user.password, password)) {
        // Jika verifikasi berhasil, kembalikan data user
        return user;
      } else {
        throw new Error('Password yang anda masukan salah'); // Jika password tidak sesuai
      }
    } else {
      
      throw new Error('Email tidak ditemukan'); // Jika email tidak ditemukan
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.register = async (username,email,password) => {

  try{
    // Periksa apakah email sudah terdaftar di database
    const emailCheckQuery = `SELECT * FROM users WHERE email = $1`;
    const emailCheckResult = await pool.query(emailCheckQuery,[email]);
    console.log(emailCheckResult)

    if (emailCheckResult.rowCount > 0) {
      throw new Error('Email sudah terdaftar');
    }

    // Enkripsi password dengan argon2
    const hashedPassword = await argon2.hash(password);

    // Simpan data user baru ke dalam database
    const insertQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id, username, email`;
    const insertResult = await pool.query(insertQuery,[username,email,hashedPassword]);

    return insertResult.rows[0]; // Kembalikan data user yang baru saja disimpan
  } catch (error) {
    throw new Error(error.message)
  }
};


