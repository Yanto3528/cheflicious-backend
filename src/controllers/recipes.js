const Recipe = require("../model/Recipe");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @description     Get all recipes
// @Method/Route    GET /api/recipes
// @Access          Public
exports.getRecipes = asyncHandler(async (req, res, next) => {
  const recipes = await Recipe.find();
  res.status(200).json(recipes);
});

// @description     Get all recipes for specific user
// @Method/Route    GET /api/users/:userId/recipes
// @Access          Public
exports.getRecipesByUser = asyncHandler(async (req, res, next) => {
  const recipes = await Recipe.find({ author: req.params.userId }).sort(
    "-createdAt"
  );
  res.status(200).json(recipes);
});

// @description     Create new Recipe
// @Method/Route    POST /api/recipes
// @Access          Private
exports.createRecipe = asyncHandler(async (req, res, next) => {
  req.body.author = req.user._id;

  const recipe = await Recipe.create(req.body);
  res.status(200).json(recipe);
});

// @description     Update existing Recipe
// @Method/Route    PUT /api/recipes/:id
// @Access          Private
exports.updateRecipe = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let recipe = await Recipe.findById(id);
  if (!recipe) {
    return next(new ErrorResponse("No recipe with this id", 404));
  }
  if (recipe.author.toString() !== req.user._id.toString()) {
    return next(
      new ErrorResponse("You are not authorized to update this", 401)
    );
  }
  recipe = await Recipe.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json(recipe);
});

// @description     Like existing Recipe
// @Method/Route    PUT /api/recipes/:id/like
// @Access          Private
exports.likeRecipe = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let recipe = await Recipe.findById(id);
  if (!recipe) {
    return next(new ErrorResponse("No recipe with this id", 404));
  }
  if (recipe.likes.includes(req.user._id)) {
    const currentUserIndex = recipe.likes.indexOf(req.user._id);
    recipe.likes.splice(currentUserIndex, 1);
  } else {
    recipe.likes.push(req.user._id);
  }
  await recipe.save();
  res.status(200).json(recipe);
});

// @description     Delete existing Recipe
// @Method/Route    DELETE /api/recipes/:id
// @Access          Private
exports.deleteRecipe = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let recipe = await Recipe.findById(id);
  if (!recipe) {
    return next(new ErrorResponse("No recipe with this id", 404));
  }
  if (recipe.author.toString() !== req.user._id.toString()) {
    return next(
      new ErrorResponse("You are not authorized to delete this", 401)
    );
  }
  await recipe.remove();
  res.status(200).json({ message: "Recipe has been deleted." });
});
