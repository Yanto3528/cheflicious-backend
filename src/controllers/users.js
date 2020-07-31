const User = require("../model/User");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @description     Get currently logged in user
// @Method/Route    GET /api/users/me
// @Access          Private
exports.getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json(req.user);
});
