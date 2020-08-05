const express = require("express");
const { getMe, updateUser } = require("../controllers/users");
const {
  validateUpdateUser,
  validationResult,
} = require("../middlewares/validator");
const { protect } = require("../middlewares/auth");
const recipeRouter = require("./recipes");

const router = express.Router();

router.use("/:userId/recipes", recipeRouter);

router.get("/me", protect, getMe);
router.put(
  "/update",
  protect,
  validateUpdateUser,
  validationResult,
  updateUser
);

module.exports = router;
