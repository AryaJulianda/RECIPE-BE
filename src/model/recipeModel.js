const pool = require('../config/db');

async function poolGetAllRecipes(sort_by, sort, page, limit) {
  const offset = (page - 1) * limit;

  let query = 'SELECT recipe.recipe_id, recipe.title, recipe.ingredients, recipe.img, category.category_name AS category FROM recipe JOIN category ON recipe.category_id = category.category_id';

  if (sort_by && sort) {
    query += ` ORDER BY ${sort_by} ${sort}`;
  }
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
}

const poolSearchRecipe = async (key, search_by, page, limit) => {
  const offset = (page - 1) * limit;
  let query = `SELECT * FROM recipe WHERE ${search_by} ILIKE '%${key}%'`;

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

async function poolAddRecipe(title, ingredients, user_id, category_id, img) {
  if (!title) throw new Error('title is required');
  if (!ingredients) throw new Error('ingredients is required');
  if (!user_id) throw new Error('user id is required');
  if (!category_id) throw new Error('category is required');

  try {
    const result = await pool.query(
      'INSERT INTO recipe (title, ingredients, user_id, category_id) VALUES ($1, $2, $3, $4) RETURNING * ',
      [title, ingredients, user_id, category_id],
    );
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function poolUpdateRecipe(title, ingredients, user_id, category_id, img, id) {
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
    throw new Error(err.message);
  }
}

async function poolDeleteRecipe(id) {
  if (Number.isNaN(id)) {
    throw new Error('Recipe not found');
  }

  try {
    const result = await pool.query('DELETE FROM recipe WHERE recipe_id = $1 RETURNING *', [id]);
    if (result.rowCount > 0) {
      return result;
    }
    throw new Error('Recipe not found');
  } catch (err) {
    throw new Error(err.message);
  }
}

async function poolGetRecipeById(id) {
  if (Number.isNaN(id)) {
    throw new Error('Recipe not found');
  }

  try {
    const result = await pool.query('SELECT * FROM recipe WHERE recipe_id = $1', [id]);
    if (result.rowCount > 0) {
      return result;
    }
    throw new Error('Recipe not found');
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  poolGetAllRecipes,
  poolSearchRecipe,
  poolAddRecipe,
  poolUpdateRecipe,
  poolDeleteRecipe,
  poolGetRecipeById,
};