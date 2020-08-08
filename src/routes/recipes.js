const express = require("express");
const Recipe = require("../model/Recipe");
const {
  getRecipes,
  getRecipesByCategory,
  getRecipesByUser,
  getRecipe,
  createRecipe,
  updateRecipe,
  likeRecipe,
  deleteRecipe,
} = require("../controllers/recipes");
const {
  validateCreateRecipe,
  validateUpdateRecipe,
  validationResult,
} = require("../middlewares/validator");
const { protect } = require("../middlewares/auth");
const advancedResults = require("../middlewares/advancedResults");
const commentRouter = require("./comments");

const router = express.Router({ mergeParams: true });

router.use("/:recipeId/comments", commentRouter);

router.get("/", advancedResults(Recipe), getRecipes);
router.get("/categories/:slug", getRecipesByCategory);
router.get("/", getRecipesByUser);
router.get("/:slug", getRecipe);
router.post("/", protect, validateCreateRecipe, validationResult, createRecipe);
router.put(
  "/:id",
  protect,
  validateUpdateRecipe,
  validationResult,
  updateRecipe
);
router.put("/:id/like", protect, likeRecipe);
router.delete("/:id", protect, deleteRecipe);

module.exports = router;
