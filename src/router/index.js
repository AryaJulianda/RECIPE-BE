const app = require('express');
const router = app.Router();
const recipe = require('./recipeRouter');
const category = require('./categoryRouter');

router.use('/recipe',recipe);
router.use('/category',category);

module.exports = router;