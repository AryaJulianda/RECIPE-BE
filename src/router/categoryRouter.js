const app = require('express');
const {authMiddleware} = require('../middleware/authMiddleware')
const router = app.Router();

const categoryController = require('../controller/categoryController');

router.get('/', authMiddleware, categoryController.getAllCategories);
router.get('/:id', authMiddleware, categoryController.getCategoryById);

module.exports = router;
