const pool = require('../config/db');

exports.updateUser = async (username,photo,id) => {
  // console.log(username,photo,id)
  if (Number.isNaN(id)) {
    throw new Error('user not found');
  }
  try {
    const result = await pool.query(
      'UPDATE users SET username = $1, photo = $2 WHERE user_id = $3 RETURNING *',
      [username,photo,id],
    );

    if (result.rowCount > 0) {
      return result;
    }
    throw new Error('Users not found');
  } catch (err) {
    // console.log(title, ingredients, user_id, category_id, img,id)
    throw new Error(err.message);
  }
}