const express = require('express');
const recipeController = require('../controller/recipeController');
const {tokenVerification} = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadImage');

const router = express.Router();

router.get('/', recipeController.getAllRecipe );
router.get('/search', recipeController.searchRecipe);
router.get('/my_recipe/:id', recipeController.getRecipeByUserId);
router.get('/:id', recipeController.getRecipeById);

router.post('/', tokenVerification,upload.single('img'), recipeController.postRecipe);
router.put('/:id', tokenVerification,upload.single('img'), recipeController.updateRecipe);
router.delete('/:id', tokenVerification, recipeController.deleteRecipe);


module.exports = router;
