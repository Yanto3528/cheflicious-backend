const User = require("../model/User");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @description     Get currently logged in user
// @Method/Route    GET /api/users/me
// @Access          Private
exports.getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json(req.user);
});

// @description     Get a single user
// @Method/Route    GET /api/users/:id/profile
// @Access          Public
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate({
    path: "recipes",
    populate: "categories",
  });
  if (!user) {
    return next(new ErrorResponse("No user found with this id", 404));
  }
  res.status(200).json(user);
});

// @description     Update user
// @Method/Route    PUT /api/users/update
// @Access          Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  if (req.body.password || req.body.email) {
    return next(new ErrorResponse("Not allowed to change this field.", 400));
  }
  await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });
  res.json({ message: "Profile updated successfully" });
});

// @description     Change password
// @Method/Route    PUT /api/users/change-password
// @Access          Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user._id).select("+password");
  if (!user) {
    return next(new ErrorResponse("No user found with this id.", 404));
  }
  const isMatch = await user.matchPassword(req.body.oldPassword);
  if (!isMatch) {
    return next(new ErrorResponse("Incorrect password.", 400));
  }
  if (req.body.oldPassword === req.body.newPassword) {
    return next(
      new ErrorResponse("New password cannot be the same as old password", 400)
    );
  }
  user.password = req.body.newPassword;
  await user.save();
  res.status(200).json({
    message: "Password has been successfully changed",
  });
});

//@desc       Follow a user
//@route      PUT /api/users/:id/follow
//@access     Private
exports.followUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  const currentUser = req.user;
  // If the currentUser already followed the user, then unfollow
  if (user.followers && user.followers.includes(currentUser._id)) {
    return next(new ErrorResponse("You already followed this user", 400));
  }

  // If the above statement is false, then follow the user
  user.followers.push(currentUser._id);
  currentUser.following.push(user._id);

  await user.save();
  await currentUser.save();

  res.status(200).json(currentUser);
});

//@desc       Unfollow a user
//@route      PUT /api/users/:id/unfollow
//@access     Private
exports.unfollowUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  const currentUser = req.user;
  // If the user already followed the target, then unfollow
  if (user.followers && user.followers.includes(currentUser._id)) {
    // Get the target user index
    const userIndex = user.followers.indexOf(currentUser._id);
    // Get current user index
    const currentUserIndex = currentUser.following.indexOf(user._id);
    // Remove current user from the followers of the target user
    user.followers.splice(userIndex, 1);
    // Remove target user from the current user following
    currentUser.following.splice(currentUserIndex, 1);
    await user.save();
    await currentUser.save();
    return res.status(200).json(currentUser);
  } else {
    return next(new ErrorResponse("You already unfollowed this user.", 400));
  }
});
