const pool = require('../config/db');

async function poolGetAllRecipes(sort_by, sort, page, limit) {
  const offset = (page - 1) * limit;

  let query = `
    SELECT
      recipe.recipe_id,
      recipe.title,
      recipe.ingredients,
      recipe.img,
      recipe.user_id,
      recipe.category_id,
      recipe.created_at,
      category.category_name AS category,
      users.username AS author,
      users.photo AS author_photo,
      COALESCE(COUNT(likes.like_id), 0) AS like_count
    FROM
      recipe
    JOIN category ON recipe.category_id = category.category_id
    JOIN users ON recipe.user_id = users.user_id
    LEFT JOIN likes ON recipe.recipe_id = likes.recipe_id
  `;

  if (sort_by && sort) {
    query += ` ORDER BY ${sort_by} ${sort}`;
  }
  if (limit) {
    query += ` LIMIT ${limit} OFFSET ${offset}`;
  }

  query += `
    GROUP BY
      recipe.recipe_id,
      recipe.title,
      recipe.ingredients,
      recipe.img,
      recipe.user_id,
      recipe.category_id,
      recipe.created_at,
      category.category_name,
      users.username,
      users.photo
  `;

  try {
    const result = await pool.query(query);
    if (result.rowCount === 0) return { message: 'recipe not found' };
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function poolGetRecipesLatest(limit) {

  let query = `
    SELECT
      recipe.recipe_id,
      recipe.title,
      recipe.ingredients,
      recipe.img,
      recipe.user_id,
      recipe.category_id,
      recipe.created_at,
      category.category_name AS category,
      users.username AS author,
      users.photo AS author_photo,
      COUNT(likes.like_id) AS like_count
    FROM
      recipe
    JOIN category ON recipe.category_id = category.category_id
    JOIN users ON recipe.user_id = users.user_id
    LEFT JOIN likes ON recipe.recipe_id = likes.recipe_id
    GROUP BY
      recipe.recipe_id,
      recipe.title,
      recipe.ingredients,
      recipe.img,
      recipe.user_id,
      recipe.category_id,
      recipe.created_at,
      category.category_name,
      users.username,
      users.photo
    ORDER BY recipe.created_at DESC
    LIMIT ${limit};`;

  try {
    const result = await pool.query(query);
    if (result.rowCount === 0) return { message: 'recipe not found' };
    return result.rows;
  } catch (err) {
    throw new Error(err.message);
  }
}


const poolGetTotalRecipeCount = async () => {
  let query = `SELECT COUNT(*) FROM recipe`;

  try {
      const result = await pool.query(query);
      return result;
  } catch (err) {
      throw new Error(err.message);
  }
};

const poolSearchRecipe = async (key, search_by, page, limit) => {
  const offset = (page - 1) * limit;
  // let query = `SELECT * FROM recipe WHERE ${search_by} ILIKE '%${key}%'`;
  let query = `SELECT
                recipe.recipe_id,
                recipe.title,
                recipe.ingredients,
                recipe.img,
                recipe.user_id,
                recipe.category_id,
                recipe.created_at,
                category.category_name AS category,
                users.username AS author,
                users.photo AS author_photo,
                COALESCE(COUNT(likes.like_id), 0) AS like_count
              FROM
                recipe
              JOIN category ON recipe.category_id = category.category_id
              JOIN users ON recipe.user_id = users.user_id
              LEFT JOIN likes ON recipe.recipe_id = likes.recipe_id
              WHERE 
                ${search_by} 
              ILIKE 
                '%${key}%'`;
                
      query += `
              GROUP BY
                recipe.recipe_id,
                recipe.title,
                recipe.ingredients,
                recipe.img,
                recipe.user_id,
                recipe.category_id,
                recipe.created_at,
                category.category_name,
                users.username,
                users.photo`;
                
      if (limit) {
        query += ` LIMIT ${limit} OFFSET ${offset}`;
      }

  try {
    const result = await pool.query(query);
    if (result.rowCount === 0) return { message: 'recipe not found' };
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

const poolGetTotalSearchRecipeCount = async (key, search_by) => {
  let query = `SELECT COUNT(*) FROM recipe WHERE ${search_by} ILIKE '%${key}%'`;

  try {
      const result = await pool.query(query);
      return result;
  } catch (err) {
      throw new Error(err.message);
  }
};


async function poolAddRecipe(title, ingredients, user_id, category_id, img) {
  if (!title) throw new Error('title is required');
  if (!ingredients) throw new Error('ingredients is required');
  if (!user_id) throw new Error('user id is required');
  if (!category_id) throw new Error('category is required');

  try {
    const result = await pool.query(
      'INSERT INTO recipe (title, ingredients, user_id, category_id, img,created_at) VALUES ($1, $2, $3, $4, $5,current_timestamp) RETURNING * ',
      [title, ingredients, user_id, category_id, img],
    );
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function poolUpdateRecipe(title, ingredients, user_id, category_id, img,id) {
  if (Number.isNaN(id)) {
    throw new Error('recipe not found');
  }
  try {
    const result = await pool.query(
      'UPDATE recipe SET title = $1, ingredients = $2, user_id = $3, category_id = $4, img=$5 WHERE recipe_id = $6 RETURNING *',
      [title, ingredients, user_id, category_id, img, id],
    );

    if (result.rowCount > 0) {
      return result;
    }
    throw new Error('Recipe not found');
  } catch (err) {
    // console.log(title, ingredients, user_id, category_id, img,id)
    throw new Error(err.message);
  }
}

async function poolDeleteRecipe(id,user_id) {
  if (Number.isNaN(id)) {
    throw new Error('Recipe not found');
  }
  
  try {
    const result = await pool.query('DELETE FROM recipe WHERE user_id = $1 AND recipe_id = $2 RETURNING *', [user_id,id]);
    if (result.rowCount > 0) {
      return result;
    }
    throw new Error('Recipe not found');
  } catch (err) {
    throw new Error(err.message);
  }
}

async function poolGetRecipeById(recipe_id) {
  if (Number.isNaN(recipe_id)) {
    throw new Error('Params wrong');
  }

  try {
    const query = `SELECT
    recipe.recipe_id,
    recipe.created_at,
    recipe.title,
    recipe.ingredients,
    recipe.img,
    recipe.user_id,
    recipe.category_id,
    category.category_name AS category,
    users.username AS author,
    users.photo AS author_photo,
    COALESCE(COUNT(likes.like_id), 0) AS like_count
  FROM
    recipe
  JOIN category ON recipe.category_id = category.category_id
  JOIN users ON recipe.user_id = users.user_id
  LEFT JOIN likes ON recipe.recipe_id = likes.recipe_id
  WHERE 
    recipe.recipe_id = $1
  GROUP BY
    recipe.recipe_id,
    recipe.title,
    recipe.ingredients,
    recipe.img,
    recipe.user_id,
    recipe.category_id,
    recipe.created_at,
    category.category_name,
    users.username,
    users.photo`;

    const result = await pool.query(query, [recipe_id]);
    if (result.rowCount > 0) {
      return result;
    } else {
      throw new Error(`No recipes with id ${recipe_id}`);
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function poolGetRecipeByUserId(user_id) {
  // console.log(user_id)
  if (Number.isNaN(user_id)) {
    throw new Error('Params wrong');
  }

  try {
    const query = `SELECT
    recipe.recipe_id,
    recipe.title,
    recipe.ingredients,
    recipe.img,
    recipe.user_id,
    recipe.category_id,
    category.category_name AS category,
    users.username AS author
  FROM
    recipe
  JOIN category ON recipe.category_id = category.category_id
  JOIN users ON recipe.user_id = users.user_id
  WHERE 
    recipe.user_id = $1`
    ;
    const result = await pool.query(query, [user_id]);
    if (result.rowCount > 0) {
      return result;
    } else {
      throw new Error(`recipe not found`);
    }
  } catch (err) {
    throw new Error(err.message);
  }
}


async function poolPostLike(userId, recipeId) {
  try {
    const existingLike = await pool.query(
      'SELECT * FROM likes WHERE user_id = $1 AND recipe_id = $2',
      [userId, recipeId]
    );
    
    let res;
    let message

    if (existingLike.rowCount === 0) {
      res = await pool.query(
        'INSERT INTO likes (user_id, recipe_id, created_at) VALUES ($1, $2, current_timestamp) RETURNING *',
        [userId, recipeId]
      );
      message = 'like success'
    } else {
      res = await pool.query(
        'DELETE FROM likes WHERE user_id = $1 AND recipe_id = $2',
        [userId, recipeId]
      );
      message = 'dislike success'
    }

    return {data:res,message:message}
} catch(err) {
    throw new Error(err.message);
  }
}

async function poolGetLikes(recipeId) {
  try {
    const result = await pool.query(
      'SELECT * FROM likes WHERE recipe_id = $1',
      [recipeId]
    );
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function poolPostComment(userId, recipeId, commentText) {
  try {
    const result = await pool.query(
      'INSERT INTO comments (user_id, recipe_id, comment_text, created_at) VALUES ($1, $2, $3, current_timestamp) RETURNING *',
      [userId, recipeId, commentText]
    );
    return result.rows[0];
  } catch (err) {
    throw new Error(err.message);
  }
}

async function poolGetComments(recipeId) {
  try {
    const result = await pool.query(
      'SELECT * FROM comments WHERE recipe_id = $1',
      [recipeId]
    );
    return result.rows;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function poolDeleteComment(commentId,userId) {
  try {
    const result = await pool.query(
      'DELETE FROM comments WHERE comment_id = $1 AND user_id = $2 RETURNING *',
      [commentId, userId]
    );

    if (result.rowCount === 0) {
      throw new Error(`Comment with ID ${commentId} not found or you do not have permission to delete it.`);
    }

    return result.rows[0];
  } catch (err) {
    throw new Error(err.message);
  }
}

async function poolAddBookmark(userId, recipeId) {
  try {
    const result = await pool.query(
      'INSERT INTO bookmarks (user_id, recipe_id, created_at) VALUES ($1, $2, current_timestamp) RETURNING *',
      [userId, recipeId]
    );
    return result.rows[0];
  } catch (err) {
    throw new Error(err.message);
  }
}

async function poolRemoveBookmark(userId, recipeId) {
  try {
    const result = await pool.query(
      'DELETE FROM bookmarks WHERE user_id = $1 AND recipe_id = $2 RETURNING *',
      [userId, recipeId]
    );
    return result.rows[0];
  } catch (err) {
    throw new Error(err.message);
  }
}

async function poolGetUserBookmarks(userId) {
  try {
    const result = await pool.query(
      'SELECT * FROM bookmarks WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
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
  poolGetRecipesLatest
};
