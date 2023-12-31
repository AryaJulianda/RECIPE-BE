// controllers/authController.js
const jwt = require('jsonwebtoken');
const config = require('../config/token');
const authModel = require('../model/authModel')
// const { v4: uuidv4 } = require('uuid'); 

exports.login = async (req, res) => {
  let { email, password ,role} = req.body;

  try {
    if(!email) throw new Error('email is required');
    if(!password) throw new Error('password is required')
    if(!role) role = 'user';
    // Find data user
    const user = await authModel.login(email, password);

    // Generate Token JWT
    const accessToken = jwt.sign({ id: user.user_id ,role: role}, config.secretKey, { expiresIn: config.expiresIn });
    const refreshToken = jwt.sign({ id: user.user_id, role: role }, config.refreshSecretKey, { expiresIn: config.refreshExpiresIn });
    
    res.json({ message: 'Login Successfully', user:user , accessToken: accessToken ,refreshToken: refreshToken});

  
  } catch (error) {
    res.status(400).json({ success: false, message: error.message,secretKey:config.secretKey });
  }
};

// exports.register = async (req, res) => {
//     const { username, email, password } = req.body;
//     // console.log(req.body)
//     try {
//       const newUser = await authModel.register(username, email, password);

//       const activationToken = jwt.sign({ email: newUser.email }, config.activationSecretKey, { expiresIn: '24h' });
//       // const activationLink = `${process.env.FE_URL}/activate?token=${activationToken}`;
//       const activationLink = `${process.env.FE_URL}/auth/activate/${activationToken}`;

//       const emailContent = `
//       <p>Klik tautan berikut untuk mengaktifkan akun Anda:</p>
//       <a href="${activationLink}">${activationLink}</a>
//     `;
//       authModel.sendActivationEmail(newUser.email, 'Acount Activation', emailContent);

//       res.json({ success: true, message: 'Registrasi berhasil', user: newUser });
//     } catch (error) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   };

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    // console.log(req.body)
    try {
      const newUser = await authModel.register(username, email, password);

      const activationToken = jwt.sign({ email: newUser.email }, config.activationSecretKey, { expiresIn: '24h' });
      // const activationLink = `${process.env.FE_URL}/activate?token=${activationToken}`;
      const activationLink = `${process.env.FE_URL}/auth/activate/${activationToken}`;

      const emailContent = `<html><body><p>Klik tautan berikut untuk mengaktifkan akun Anda:</p><a href="${activationLink}">${activationLink}</a></body></html>`;
      authModel.sendActivationEmail(newUser.email, 'Acount Activation', emailContent);

      res.json({ success: true, message: 'Registrasi berhasil', user: newUser });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // Verify refresh token
    const decodedRefreshToken = jwt.verify(refreshToken, config.refreshSecretKey);

    // Generate new access token
    const accessToken = jwt.sign({ id: decodedRefreshToken.id, role: decodedRefreshToken.role }, config.secretKey, { expiresIn: config.expiresIn });

    res.json({ accessToken: accessToken });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

exports.activateAccount = async (req, res) => {
  const activationToken = req.params.token;
    console.log(activationToken)

  try {
    const decodedToken = jwt.verify(activationToken, config.activationSecretKey);
    const userEmail = decodedToken.email;

    // Aktivasi Akun di Database
    await authModel.activateUserAccount(userEmail);
    res.status(200).json({ success: true, message: 'Activation successfully' });
  } catch (error) {
    // res.redirect('/login?message=invalidActivationLink');
    res.status(400).json({ success: false, message: error.message });
  }
};

  // exports.refreshToken = async (req,res) => {
  //   try{
  //     const {id} = req.params;
  //     const result = await pool.query('SELECT * FROM refresh_tokens WHERE user_id = $1', [id])
  //     const user = result.rows[0];
  
  //     jwt.verify(user.token, config.secretKey, (err, decoded) => {
  //       if (err) {
  //         return res.status(401).json({ error: 'Invalid refresh token' });
  //       }
  //       const payload = decoded;
  //       // Jika refresh token valid, buat access token baru dan kirimkan kembali ke klien
  //       const token = jwt.sign({id:payload.id,role:payload.role}, config.secretKey, { expiresIn: config.expiresIn });
  //       res.cookie('jwt', token, { httpOnly: true, secure: true })
  //         .json({message:'refresh token is successfully', newToken: token })
  //     })
  //   } catch(err) {
  //     res.json({message:err.message})
  //   }
  // }