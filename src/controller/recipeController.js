const {
  poolGetAllRecipes,
  poolSearchRecipe,
  poolGetTotalSearchRecipeCount,
  poolGetTotalRecipeCount,
  poolAddRecipe,
  poolUpdateRecipe,
  poolDeleteRecipe,
  poolGetRecipeByUserId,
  poolGetRecipeById,
  poolPostLike,
  poolGetLikes,
  poolPostComment,
  poolGetComments,
  poolDeleteComment,
  poolAddBookmark,
  poolRemoveBookmark,
  poolGetUserBookmarks,
  poolGetRecipesLatest,
  poolGetUserLikedRecipes,
  poolGetRecipesPopular
} = require('../model/recipeModel');
// const cloudinary = require('cloudinary').v2;
// const upload = require('../middleware/uploadImage');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

const recipeController = {
  getAllRecipe: async (req, res, next) => {
    const {
      sort_by, sort, page, limit
    } = req.query;

    try {
      const result = await poolGetAllRecipes(sort_by, sort, page, limit);

      const totalCountQuery = await poolGetTotalRecipeCount();
      const totalCount = parseInt(totalCountQuery.rows[0].count);

      res.json({ totalCount, recipes: result.rows });
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

      const totalCountQuery = await poolGetTotalSearchRecipeCount(key, search_by);
      const totalCount = parseInt(totalCountQuery.rows[0].count);

      res.json({ totalCount, recipes: result.rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  postRecipe: async (req, res, next) => {
    const { title, ingredients, category_id } = req.body;
    // console.log({'reqbody' : req.body ,'reqfile': req.file});
    const user_id = req.userId;
  
    try {
      let img ;

      if (req.file && req.file.path) {
        img = req.file.path;
      }

        const result = await poolAddRecipe(title, ingredients, user_id, category_id, img);

        res.json({
          message: 'Resep berhasil ditambahkan',
          data: result.rows[0],
        });
    } catch (err) {
      console.log(err.message)
      res.status(500).json({ error: err.message });
    }
  },
  updateRecipe: async (req, res, next) => {
    const { id } = req.params;
    const { title, ingredients, category_id } = req.body;
    const user_id = req.userId;
    let img ;

    if (req.file && req.file.path) {
      img = req.file.path;
    }

    try {
      const oldData = await poolGetRecipeById(id);
      // console.log(oldData.rows[0].title)
      // console.log(req.body.title)

      if(oldData.rows[0].user_id !== user_id) {
        throw new Error('you dont have access')
      }
      
      if(!img){img=oldData.rows[0].img};

      const newData = {
        title: title,
        ingredients: ingredients,
        user_id: user_id ,
        category_id: category_id,
        img: img,
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
      console.log('edit gagla',err)
      res.status(500).json({ error: err.message });
    }
  },
  deleteRecipe: async (req, res, next) => {
    const { id } = req.params;
    const user_id = req.userId;

    try {
      const check = await poolGetRecipeById(id);

      if (check.rows[0].user_id !== user_id){
        console.log('You dont have access',check.rows[0].user_id,user_id)
        throw new Error('You dont have access',check.rows[0].user_id,user_id);
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
  getRecipeByUserId: async (req, res, next) => {
    const { id } = req.params;

    try {
      const result = await poolGetRecipeByUserId(id);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ message: err.message});
    }
  },
  postLike: async (req, res, next) => {
    const recipeId = req.params.id;
    const userId = req.userId;
    // console.log(userId,recipeId)

    try {
        const result = await poolPostLike(userId,recipeId);

        res.json({
          message: result.message,
          data: result.data.rows[0],
        });
    } catch (err) {
      console.log(err.message)
      res.status(500).json({ error: err.message });
    }
  },
  getLikes: async (req, res, next) => {
    const recipeId = req.params.id;
    // console.log(recipeId)

    try {
        const result = await poolGetLikes(recipeId);

        res.json({
          message: 'Jumlah like berhasil didapat',
          data: result.rowCount,
        });
    } catch (err) {
      console.log(err.message)
      res.status(500).json({ error: err.message });
    }
  },
  postComment: async (req, res, next) => {
    const recipeId = req.params.id;
    const userId = req.userId;
    const { commentText }= req.body;
    // console.log(userId,recipeId)

    try {
        const result = await poolPostComment(userId,recipeId,commentText);

        res.json({
          message: 'add comment success',
          data: result,
        });
    } catch (err) {
      console.log(err.message)
      res.status(500).json({ error: err.message });
    }
  },
  getComments: async (req, res, next) => {
    const recipeId = req.params.id;
    // console.log(recipeId)

    try {
        const result = await poolGetComments(recipeId);

        res.json({
          message: 'Get Comments Successfull',
          data: result
        });
    } catch (err) {
      console.log(err.message)
      res.status(500).json({ error: err.message });
    }
  },
  deleteComment: async (req, res, next) => {
    const commentId = req.params.commentId;
    const userId = req.userId;

    try {
        const result = await poolDeleteComment(commentId,userId);

        res.json({
          message: 'del comment success',
          data: result,
        });
    } catch (err) {
      console.log(err.message)
      res.status(500).json({ error: err.message });
    }
  },
  addBookmark: async (req, res, next) => {
    const userId = req.userId;
    const recipeId = req.params.id;

    try {
      const result = await poolAddBookmark(userId, recipeId);
      res.json({ message: 'Bookmark added successfully', data :result}); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  removeBookmark: async (req, res, next) => {
    const userId = req.userId;
    const recipeId = req.params.id;
  
    try {
      const result = await poolRemoveBookmark(userId, recipeId);
      res.json({ message: 'Bookmark removed successfully', data: result});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  getUserBookmarks: async (req, res, next) => {
    const userId = req.userId; 
  
    try {
      const bookmarks = await poolGetUserBookmarks(userId);
      res.json({ data : bookmarks });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  getUserLikedRecipes: async (req, res, next) => {
    const userId = req.userId; 
  
    try {
      const likedRecipes = await poolGetUserLikedRecipes(userId);
      res.json({ data : likedRecipes });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err });
    }
  },
  getRecipesLatest: async (req, res, next) => {
    const limit = 10;

    try {
      const result = await poolGetRecipesLatest(limit);
      res.json({data : result})
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: err });
    }
  },
  getRecipesPopular: async (req, res, next) => {
    const limit = 10;

    try {
      const result = await poolGetRecipesPopular(limit);
      res.json({data : result})
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: err });
    }
  }
  
};

module.exports = recipeController;
