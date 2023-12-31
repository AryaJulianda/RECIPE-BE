const pool = require('../config/db');

const poolGetAllCategory = async () => {
  const query = 'SELECT * FROM category';

  try {
    const result = await pool.query(query);
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

const poolGetCategoryById = async (id) => {
  if (Number.isNaN(id)) throw new Error('Category not found');
  const query = `SELECT * FROM category WHERE category_id = ${id}`;

  try {
    const result = await pool.query(query);
    if (result.rowCount === 0) throw new Error('Category not found');
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { poolGetAllCategory, poolGetCategoryById };
