const express = require("express");
const { getCategories, createCategory } = require("../controllers/categories");
const {
  validateCreateCategory,
  validationResult,
} = require("../middlewares/validator");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.get("/", getCategories);
router.post(
  "/",
  protect,
  validateCreateCategory,
  validationResult,
  createCategory
);

module.exports = router;
