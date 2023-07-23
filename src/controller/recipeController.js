const {
  poolGetAllRecipes,
  poolSearchRecipe,
  poolAddRecipe,
  poolUpdateRecipe,
  poolDeleteRecipe,
  poolGetRecipeById,
} = require('../model/recipeModel');

const RecipeController = {
  getAllRecipe: async (req, res, next) => {
    const {
      sort_by, sort, page, limit,
    } = req.query;

    try {
      const result = await poolGetAllRecipes(sort_by, sort, page, limit);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  searchRecipe: async (req, res, next) => {
    const { key, page, limit } = req.query;
    let { search_by } = req.query;
    if (!search_by) search_by = 'title';

    try {
      const result = await poolSearchRecipe(key, search_by, page, limit);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  postRecipe: async (req, res, next) => {
    const {
      title, ingredients, category_id, img,
    } = req.body;

    const user_id = req.userId;

    try {
      const result = await poolAddRecipe(title, ingredients, user_id, category_id, img);

      res.json({
        message: 'Add recipe is successfully',
        data: result.rows[0],
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  updateRecipe: async (req, res, next) => {
    const { id } = req.params;
    const {
      title, ingredients, category_id, img,
    } = req.body;
    const user_id = req.userId;

    try {
      const oldData = await poolGetRecipeById(id);

      if(oldData.rows[0].user_id !== user_id) {
        throw new Error('you dont have access')
      }

      const newData = {
        title: title || oldData.title,
        ingredients: ingredients || oldData.rows[0].ingredients,
        user_id: user_id || oldData.rows[0].user_id,
        category_id: category_id || oldData.rows[0].category_id,
        img: img || oldData.rows[0].img,
      };

      const result = await poolUpdateRecipe(
        newData.title,
        newData.ingredients,
        newData.user_id,
        newData.category_id,
        newData.img,
        id,
      );
      res.json({
        message: 'Edit recipe is successfully',
        new_data: result.rows[0],
        oldData: oldData.rows[0],
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteRecipe: async (req, res, next) => {
    const { id } = req.params;
    const user_id = req.userId;

    try {
      const check = await poolGetRecipeById(id);

      if (check.rows[0].user_id !== user_id){
        throw new Error('You dont have access');
      }

      const result = await poolDeleteRecipe(id,user_id);
      res.json({
        message: 'Delete recipe is successfully',
        data: result.rows[0],
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getRecipeById: async (req, res, next) => {
    const { id } = req.params;

    try {
      const result = await poolGetRecipeById(id);
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = RecipeController;
