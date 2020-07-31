const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
