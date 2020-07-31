const express = require("express");
const {
  getRecipes,
  getRecipesByUser,
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
const commentRouter = require("./comments");

const router = express.Router({ mergeParams: true });

router.use("/:recipeId/comments", commentRouter);

router.get("/", getRecipes);
router.get("/", getRecipesByUser);
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
