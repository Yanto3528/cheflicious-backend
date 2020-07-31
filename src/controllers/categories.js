const Category = require("../model/Category");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @description     Get all categories
// @Method/Route    GET /api/categories
// @Access          Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json(categories);
});

// @description     Create new Category
// @Method/Route    POST /api/categories
// @Access          Private
exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);
  res.status(200).json(category);
});
