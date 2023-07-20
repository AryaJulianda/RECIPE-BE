const express = require('express');
const recipeController = require('../controller/recipeController');

const router = express.Router();

router.get('/', recipeController.getAllRecipe);
router.get('/search', recipeController.searchRecipe);
router.post('/', recipeController.postRecipe);
router.put('/:id', recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);
router.get('/:id', recipeController.getRecipeById);

module.exports = router;
