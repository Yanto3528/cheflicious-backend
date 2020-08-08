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
      // required: true,
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
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  { timestamps: true }
);

function autoPopulate(next) {
  this.populate("categories").populate({ path: "comments", select: "_id" });
  next();
}

function autoPopulateCommentsWithAuthor(next) {
  this.populate("categories").populate({
    path: "comments",
    populate: { path: "author", select: "name avatar" },
  });
  next();
}

RecipeSchema.pre("find", autoPopulate);
RecipeSchema.pre("findOne", autoPopulateCommentsWithAuthor);
RecipeSchema.pre("findByIdAndUpdate", autoPopulateCommentsWithAuthor);

RecipeSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "recipe",
  justOne: false,
});

module.exports = mongoose.model("Recipe", RecipeSchema);
