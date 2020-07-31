const { check, validationResult } = require("express-validator");

// Auth
exports.validateRegister = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Email is not valid").isEmail(),
  check("password", "Password must be at least 6 character or more").isLength({
    min: 6,
  }),
];

exports.validateLogin = [
  check("email", "Email is not valid").isEmail(),
  check("password", "Password must be at least 6 character or more").isLength({
    min: 6,
  }),
];

// Categories
exports.validateCreateCategory = [
  check("name", "Name is required").not().isEmpty(),
];

// Recipes
exports.validateCreateRecipe = [
  check("title", "Title is required").not().isEmpty(),
  check(
    "ingredients",
    "Ingredient must be at least 1 or more ingredient"
  ).isArray({ min: 1 }),
  check(
    "instructions",
    "Instruction must be at least 1 or more instruction"
  ).isArray({ min: 1 }),
  // check("cookingTime", "Please provide how long the cooking time is.").isDate(),
];

exports.validateUpdateRecipe = [
  check("title", "Title is required").not().isEmpty().optional(),
  check("ingredients", "Ingredient must be at least 1 or more ingredient")
    .isArray({ min: 1 })
    .optional(),
  check("instructions", "Instruction must be at least 1 or more instruction")
    .isArray({ min: 1 })
    .optional(),
  // check("cookingTime", "Please provide how long the cooking time is.").isDate(),
];

// Comments
exports.validateCreateComment = [
  check("content", "Cannot create comment with empty text").not().isEmpty(),
];

exports.validationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};
