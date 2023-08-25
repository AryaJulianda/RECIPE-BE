const express = require('express');
const recipeController = require('../controller/recipeController');
const {tokenVerification} = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadImage');

const router = express.Router();

router.get('/', recipeController.getAllRecipe );
router.get('/search', recipeController.searchRecipe);
router.get('/my_recipe/:id', recipeController.getRecipeByUserId);
router.get('/:id', recipeController.getRecipeById);

router.get('/latest/get', recipeController.getRecipesLatest);

router.post('/', tokenVerification,upload.single('img'), recipeController.postRecipe);
router.put('/:id', tokenVerification,upload.single('img'), recipeController.updateRecipe);
router.delete('/:id', tokenVerification, recipeController.deleteRecipe);

router.get('/likes/:id',recipeController.getLikes);
router.get('/comments/:id',recipeController.getComments);
router.post('/like/:id',tokenVerification,recipeController.postLike);
router.post('/comment/:id',tokenVerification,recipeController.postComment);
router.delete('/comment/:commentId',tokenVerification,recipeController.deleteComment);

router.post('/bookmark/:id', tokenVerification, recipeController.addBookmark);
router.delete('/bookmark/:id', tokenVerification, recipeController.removeBookmark);
router.get('/bookmarks/get', tokenVerification, recipeController.getUserBookmarks);


module.exports = router;
