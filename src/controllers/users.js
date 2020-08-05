const User = require("../model/User");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @description     Get currently logged in user
// @Method/Route    GET /api/users/me
// @Access          Private
exports.getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json(req.user);
});

// @description     Update user
// @Method/Route    PUT /api/users/update
// @Access          Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });
  res.json(user);
});
