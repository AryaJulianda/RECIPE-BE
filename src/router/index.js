const app = require('express');

const router = app.Router();
const recipe = require('./recipeRouter');
const category = require('./categoryRouter');
const auth = require('./authRouter')

router.use('/recipe', recipe);
router.use('/category', category);
router.use('/auth',auth)
module.exports = router;
