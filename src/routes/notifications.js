const express = require("express");
const {
  getNotifications,
  readNotifications,
  deleteNotifications,
  deleteNotification,
} = require("../controllers/notifications");

const { protect } = require("../middlewares/auth");

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/", protect, readNotifications);
router.delete("/", protect, deleteNotifications);
router.delete("/:id", protect, deleteNotification);

module.exports = router;
