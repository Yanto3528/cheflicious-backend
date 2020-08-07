const express = require("express");
const {
  getMe,
  getUser,
  updateUser,
  changePassword,
  followUser,
  unfollowUser,
} = require("../controllers/users");
const {
  validateUpdateUser,
  validateChangePassword,
  validationResult,
} = require("../middlewares/validator");
const { protect } = require("../middlewares/auth");
const recipeRouter = require("./recipes");

const router = express.Router();

router.use("/:userId/recipes", recipeRouter);

router.get("/me", protect, getMe);
router.get("/:id/profile", getUser);
router.put(
  "/update",
  protect,
  validateUpdateUser,
  validationResult,
  updateUser
);
router.put(
  "/change-password",
  protect,
  validateChangePassword,
  validationResult,
  changePassword
);
router.put("/:id/follow", protect, followUser);
router.put("/:id/unfollow", protect, unfollowUser);

module.exports = router;
