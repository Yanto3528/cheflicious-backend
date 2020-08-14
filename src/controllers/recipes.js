const slugify = require("slugify");
const Recipe = require("../model/Recipe");
const Category = require("../model/Category");
const Notification = require("../model/Notification");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const { getIO } = require("../utils/socket");

// @description     Get all recipes
// @Method/Route    GET /api/recipes
// @Access          Public
exports.getRecipes = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @description     Get all recipes by specific category
// @Method/Route    GET /api/recipes/categories/:slug
// @Access          Public
exports.getRecipesByCategory = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  const category = await Category.findOne({ slug });

  const page = req.query.page || 1;
  const limit = 9;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Recipe.countDocuments({ categories: category });

  const recipes = await Recipe.find({ categories: category })
    .sort("-createdAt")
    .skip(startIndex)
    .limit(limit);
  let nextPage;
  let prevPage;
  if (endIndex < total) {
    nextPage = true;
  } else {
    nextPage = false;
  }
  if (startIndex > 0) {
    prevPage = true;
  } else {
    prevPage = false;
  }
  res.status(200).json({
    title: category.value,
    total,
    count: recipes.length,
    prevPage,
    nextPage,
    data: recipes,
  });
});

// @description     Get all recipes for specific user
// @Method/Route    GET /api/users/:userId/recipes
// @Access          Public
exports.getRecipesByUser = asyncHandler(async (req, res, next) => {
  const recipes = await Recipe.find({ author: req.params.userId })
    // .populate({ path: "comments", select: "content" })
    .sort("-createdAt")
    .lean();
  res.status(200).json(recipes);
});

// @description     Get a single recipe
// @Method/Route    GET /api/recipes/:slug
// @Access          Public
exports.getRecipe = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  const recipe = await Recipe.findOne({ slug })
    .populate({ path: "author", select: "name" })
    .lean();

  const recipes = await Recipe.find({
    $and: [
      {
        _id: { $ne: recipe._id },
      },
      {
        $or: [{ categories: { $in: recipe.categories } }],
      },
    ],
  })
    .limit(3)
    .lean();

  res.status(200).json({ recipe, relatedRecipes: recipes });
});

// @description     Create new Recipe
// @Method/Route    POST /api/recipes
// @Access          Private
exports.createRecipe = asyncHandler(async (req, res, next) => {
  req.body.author = req.user._id;

  req.body.slug = slugify(req.body.title, {
    remove: /[*+~.()'"!:@]/g,
    lower: true,
  });

  await Recipe.create(req.body);
  res.status(200).json({ message: "Recipe created" });
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
      new ErrorResponse("You are not authorized to update this", 400)
    );
  }
  recipe = await Recipe.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json({ message: "Recipe updated successfully" });
});

// @description     Like existing Recipe
// @Method/Route    PUT /api/recipes/:id/like
// @Access          Private
exports.likeRecipe = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let recipe = await Recipe.findById(id).populate({
    path: "author",
    select: "name avatar socketId",
  });
  if (!recipe) {
    return next(new ErrorResponse("No recipe with this id", 404));
  }
  if (recipe.likes.includes(req.user._id)) {
    const currentUserIndex = recipe.likes.indexOf(req.user._id);
    recipe.likes.splice(currentUserIndex, 1);
  } else {
    recipe.likes.push(req.user._id);
    const notification = await Notification.create({
      receiver: recipe.author._id,
      sender: { name: req.user.name, avatar: req.user.avatar },
      recipeSlug: recipe.slug,
      message: `<strong>${req.user.name}</strong> liked your recipe`,
    });
    const io = getIO();
    io.to(recipe.author.socketId).emit("getNotification", notification);
  }
  await recipe.save();
  res.status(200).json({ success: true });
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
      new ErrorResponse("You are not authorized to delete this", 400)
    );
  }
  await recipe.remove();
  res.status(200).json({ message: "Recipe has been deleted." });
});
