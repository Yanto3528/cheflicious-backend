const express = require("express");
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/comments");
const {
  validateCreateComment,
  validationResult,
} = require("../middlewares/validator");
const { protect } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router.get("/", getComments);
router.post(
  "/",
  protect,
  validateCreateComment,
  validationResult,
  createComment
);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

module.exports = router;
