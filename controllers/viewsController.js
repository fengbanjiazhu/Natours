const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const Booking = require('../models/bookingModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  // get tour data from collection
  const tours = await Tour.find();

  // build template

  // render the template
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const slug = req.params.slug;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new appError('There is no tour with that name', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.loginView = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: `Login to your account`,
  });
});

exports.signupView = catchAsync(async (req, res) => {
  res.status(200).render('signup', {
    title: `Sign up`,
  });
});

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: `Your Account`,
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // find tours with the id
  const tourIDs = bookings.map((el) => el.tour.id);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  console.log('my booking', tours);

  if (tours.length > 0) {
    res.status(200).render('overview', {
      title: `My tours`,
      tours,
    });
  } else {
    res.status(200).render('overview', {
      title: `My tours`,
    });
  }
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: `Your Account`,
    user: updatedUser,
  });
});
