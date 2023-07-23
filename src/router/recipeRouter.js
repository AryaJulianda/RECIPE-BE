const express = require('express');
const recipeController = require('../controller/recipeController');
const {authMiddleware} = require('../middleware/authMiddleware')

const router = express.Router();

router.get('/', recipeController.getAllRecipe );
router.get('/search', recipeController.searchRecipe);
router.get('/:id', recipeController.getRecipeById);

router.post('/', authMiddleware, recipeController.postRecipe);
router.put('/:id', authMiddleware, recipeController.updateRecipe);
router.delete('/:id', authMiddleware, recipeController.deleteRecipe);


module.exports = router;
