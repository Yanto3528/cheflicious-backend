const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      name: String,
      avatar: String,
    },
    message: {
      type: String,
      required: true,
    },
    recipeSlug: String,
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
