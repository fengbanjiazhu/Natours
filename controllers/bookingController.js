const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // get current booked tour
  const tour = await Tour.findById(req.params.tourId);

  // create session
  const product = await stripe.products.create({
    name: `${tour.name} Tour`,
    description: tour.summary,
    images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
  });
  // console.log('Product ID:', product.id);

  const price = await stripe.prices.create({
    product: `${product.id}`,
    unit_amount: tour.price * 100,
    currency: 'usd',
  });
  // console.log('Price ID:', price.id);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: `${price.id}`,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
  });

  // send to client
  res.status(200).json({
    status: 'success',
    session,
  });
});
