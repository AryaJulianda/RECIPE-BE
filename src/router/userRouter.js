const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const upload = require('../middleware/uploadImage');

router.put('/edit/:id', upload.single('img'), userController.update);

module.exports = router;
