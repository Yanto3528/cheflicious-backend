const express = require("express");
const { register, login, logout } = require("../controllers/auth");
const {
  validateRegister,
  validateLogin,
  validationResult,
} = require("../middlewares/validator");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", validateRegister, validationResult, register);
router.post("/login", validateLogin, validationResult, login);
router.post("/logout", protect, logout);

module.exports = router;
