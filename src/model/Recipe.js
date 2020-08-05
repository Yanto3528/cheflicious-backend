const mongoose = require("mongoose");

const RecipeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        value: {
          type: String,
          required: true,
        },
      },
    ],
    instructions: [
      {
        value: {
          type: String,
          required: true,
        },
      },
    ],
    servings: {
      type: Number,
      default: 1,
    },
    cookingTime: {
      type: Number,
      default: 5,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", RecipeSchema);
