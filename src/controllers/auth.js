const User = require("../model/User");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @description     Register a new user
// @Method/Route    POST /api/auth/register
// @Access          Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorResponse("User already exists. Please sign in.", 401));
  }
  user = await User.create(req.body);
  const token = user.getSignedJwtToken();
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json({ message: "Register successfully" });
});

// @description     Login a user
// @Method/Route    POST /api/auth/login
// @Access          Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }
  const token = user.getSignedJwtToken();
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json({ message: "Login successfully" });
});

// @description     Logout a user
// @Method/Route    POST /api/auth/logout
// @Access          Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).clearCookie("token").json({ message: "Logout successfully" });
});
