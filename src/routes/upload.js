const express = require("express");
const upload = require("../upload");
const { uploadImage } = require("../controllers/upload");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.post("/", protect, upload, uploadImage);

module.exports = router;
