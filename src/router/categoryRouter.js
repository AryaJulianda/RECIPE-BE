const app = require('express');
const router = app.Router();

const categoryController = require('../controller/categoryController.js');

router.get('/',categoryController.getAllCategories);
router.get('/:id',categoryController.getCategoryById);

module.exports = router;