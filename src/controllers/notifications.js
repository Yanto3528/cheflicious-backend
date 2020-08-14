const Notification = require("../model/Notification");
const asyncHandler = require("../middlewares/async");

// @description     Get all notification for currently logged in user
// @Method/Route    GET /api/notifications
// @Access          Private
exports.getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    receiver: req.user._id,
  })
    .sort("-createdAt")
    .lean();
  res.status(200).json(notifications);
});

// @description     Read all notifications for specific user
// @Method/Route    PUT /api/notifications
// @Access          Private
exports.readNotifications = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    {
      receiver: req.user._id,
    },
    { $set: { read: true } }
  ).sort("-createdAt");
  res.status(200).json({
    success: true,
  });
});

// @description     Delete all notifications for specific user
// @Method/Route    DELETE /api/notifications/
// @Access          Private
exports.deleteNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({
    receiver: req.user._id,
  });
  res.status(200).json({
    success: true,
    data: [],
  });
});

// @description     Delete single notification for specific user
// @Method/Route    DELETE /api/notifications/:id
// @Access          Private
exports.deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (notification.receiver.toString() !== req.user._id.toString()) {
    return res
      .status(400)
      .json({ error: "You are not allowed to delete this notification." });
  }
  await notification.remove();
  res.status(200).json({
    success: true,
  });
});
