const app = require('express');
const {tokenVerification, validateRole} = require('../middleware/authMiddleware')
const router = app.Router();

const categoryController = require('../controller/categoryController');

router.get('/', tokenVerification, categoryController.getAllCategories);
router.get('/:id', tokenVerification, categoryController.getCategoryById);

module.exports = router;
