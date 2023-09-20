// models/authModel.js
const argon2 = require('argon2');
const pool = require('../config/db');
const token = require('../config/token')
const emailTester = require('../config/emailTester')
const nodemailer = require('nodemailer');
const SibApiV3Sdk = require('sib-api-v3-sdk');

exports.login = async (email, password) => {
  try {
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    const result = await pool.query(query);

    if (result.rowCount > 0) {
      const user = result.rows[0];
      if(!user.is_active) {
        throw new Error('Please activate your acount')
      } else if (await argon2.verify(user.password, password)) {
        return user;
      } else {
        throw new Error('Wrong password!');
      }

    } else {
      throw new Error('Email not found, please register if you dont have account before');
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

// exports.sendActivationEmail = (to, subject, content) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp-relay.brevo.com',
//     port: 587,
//     secure:false,
//     auth: {
//         user: 'arya.julianda21@gmail.com',
//         pass: 'HMLGs20KDJpyNCbj'
//     }
//   });

//   const mailOptions = {
//     from: emailTester.email,
//     to: to,
//     subject: subject,
//     html: content
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     console.log(emailTester,'ini transporter')
//     if (error) {
//       console.log('Error sending email:', error);
//     } else {
//       console.log('Email sent:', info.response);
//     }
//   });
// };

exports.sendActivationEmail = (to, subject, content) => {

  let defaultClient = SibApiV3Sdk.ApiClient.instance;
  
  let apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = emailTester.apiKey;
  
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = content;
  sendSmtpEmail.sender = {"name":"Mama Recipe","email":"arya.julianda21@gmail.com"};
  sendSmtpEmail.to = [{"email":to}];
  // sendSmtpEmail.cc = [{"email":"example2@example2.com","name":"Janice Doe"}];
  // sendSmtpEmail.bcc = [{"email":"John Doe","name":"example@example.com"}];
  sendSmtpEmail.replyTo = {"email":"arya.julianda21@gmail.com","name":"Arya Julianda"};
  // sendSmtpEmail.headers = {"Some-Custom-Name":"unique-id-1234"};
  // sendSmtpEmail.params = {"parameter":"My param value","subject":"New Subject"};
  
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    console.log(sendSmtpEmail)
  }, function(error) {
    console.error(error);
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
