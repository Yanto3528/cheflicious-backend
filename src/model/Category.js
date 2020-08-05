const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

CategorySchema.virtual("recipes", {
  ref: "Recipe",
  localField: "_id",
  foreignField: "categories",
  justOne: false,
});

module.exports = mongoose.model("Category", CategorySchema);
