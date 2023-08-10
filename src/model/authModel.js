// models/authModel.js
const argon2 = require('argon2');
const pool = require('../config/db');
const token = require('../config/token')
const emailTester = require('../config/emailTester')
const nodemailer = require('nodemailer');

exports.login = async (email, password) => {
  try {
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    const result = await pool.query(query);

    if (result.rowCount > 0) {
      const user = result.rows[0];
      if (await argon2.verify(user.password, password)) {
        return user;
      } else {
        throw new Error('Password yang anda masukan salah');
      }
    } else {
      throw new Error('Email tidak ditemukan');
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.register = async (username,email,password) => {

  try{
    const emailCheckQuery = `SELECT * FROM users WHERE email = $1`;
    const emailCheckResult = await pool.query(emailCheckQuery,[email]);
    // console.log(emailCheckResult)

    if (emailCheckResult.rowCount > 0) {
      throw new Error('Email sudah terdaftar');
    }

    const hashedPassword = await argon2.hash(password);

    const insertQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id, username, email`;
    const insertResult = await pool.query(insertQuery,[username,email,hashedPassword]);

    return insertResult.rows[0];
  } catch (error) {
    throw new Error(error.message)
  }
};

exports.sendActivationEmail = (to, subject, content) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: emailTester.email,
        pass: emailTester.password
    }
  });

  const mailOptions = {
    from: emailTester.email,
    to: to,
    subject: subject,
    html: content
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

exports.activateUserAccount = async (email) => {
  try {
    const query = 'UPDATE users SET is_active = true WHERE email = $1';
    await pool.query(query, [email]);
  } catch (error) {
    throw error;
  }
};

exports.getUserById = async (userId) => {
  try {
    const query = 'SELECT * FROM users WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
