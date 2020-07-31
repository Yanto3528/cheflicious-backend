const express = require("express");
const { getMe } = require("../controllers/users");
// const {
//   validateCreateRecipe,
//   validateUpdateRecipe,
//   validationResult,
// } = require("../middlewares/validator");
const { protect } = require("../middlewares/auth");
const recipeRouter = require("./recipes");

const router = express.Router();

router.use("/:userId/recipes", recipeRouter);

router.get("/me", protect, getMe);

module.exports = router;
