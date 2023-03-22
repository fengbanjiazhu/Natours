const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email & password exist
  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }

  // check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  const correct = await user?.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError('incorrect email or password', 401));
  }

  // if all correct, send token back to user
  token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1 get token, check status
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Please log in first', 401));
  }
  // 2 validate token   jwt.verify(token, secret)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3 check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user no longer exist', 401));
  }
  // 4 if user changed password after token issued
  if (currentUser.changesPasswordAfter(decoded.iat)) {
    return next(
      new AppError('The password has been changed, please login again', 401)
    );
  }
  // Grand Access to Protected Route
  req.user = currentUser;
  next();
});

// restrictTo() runs after protect() ⬆️
// so we could use req.user to get user info
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array, ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1 Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }

  // 2 generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3 Send it to user's email
});

exports.resetPassword = (req, res, next) => {};
