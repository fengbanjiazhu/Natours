const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');

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
