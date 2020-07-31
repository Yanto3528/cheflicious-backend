const Comment = require("../model/Comment");
const Recipe = require("../model/Recipe");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @description     Get all Comments for specific recipe
// @Method/Route    GET /api/recipes/:recipeId/comments
// @Access          Public
exports.getComments = asyncHandler(async (req, res, next) => {
  const { recipeId } = req.params;
  const comments = await Comment.find({ recipe: recipeId }).populate({
    path: "author",
    select: "name avatar",
  });
  res.status(200).json(comments);
});

// @description     Create new Comment
// @Method/Route    POST /api/recipes/:recipeId/comments
// @Access          Private
exports.createComment = asyncHandler(async (req, res, next) => {
  const { recipeId } = req.params;
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    return next(new ErrorResponse("There is no recipe with this id", 404));
  }

  req.body.recipe = recipeId;
  req.body.author = req.user._id;

  let comment = await Comment.create(req.body);
  comment = await comment
    .populate({ path: "author", select: "name avatar" })
    .execPopulate();
  res.status(200).json(comment);
});

// @description     Update existing Comment
// @Method/Route    PUT /api/comments/:id
// @Access          Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let comment = await Comment.findById(id);
  if (!comment) {
    return next(new ErrorResponse("No Comment with this id", 404));
  }
  if (comment.author.toString() !== req.user._id.toString()) {
    return next(
      new ErrorResponse("You are not authorized to update this", 401)
    );
  }
  comment = await Comment.findByIdAndUpdate(id, req.body, {
    new: true,
  }).populate({ path: "author", select: "name avatar" });
  res.status(200).json(comment);
});

// @description     Delete existing Comment
// @Method/Route    DELETE /api/comments/:id
// @Access          Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let comment = await Comment.findById(id);
  if (!comment) {
    return next(new ErrorResponse("No Comment with this id", 404));
  }
  if (comment.author.toString() !== req.user._id.toString()) {
    return next(
      new ErrorResponse("You are not authorized to delete this", 401)
    );
  }
  await comment.remove();
  res.status(200).json({ message: "Comment has been deleted." });
});
