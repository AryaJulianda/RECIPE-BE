const {
  poolGetAllCategory,
  poolGetCategoryById,
} = require('../model/categoryModel');

const categoryController = {
  getAllCategories: async (req, res, next) => {
    try {
      const result = await poolGetAllCategory();
      res.status(200).json(result.rows);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getCategoryById: async (req, res, next) => {
    const { id } = req.params;

    try {
      const result = await poolGetCategoryById(id);
      res.status(200).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = categoryController;
