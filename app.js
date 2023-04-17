const morgan = require('morgan');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cors = require('cors');

const appErr = require('./utils/appError');
const globalErrHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1 GLOBAL Middleware

// Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cors({
    origin: '*',
  })
);

// Set security HTTP headers
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'default-src': ["'self'"],
      'connect-src': ["'self'", '*'],
      'img-src': ["'self'", 'https: data:'],
      'script-src': ["'self'", 'https: data:'],
    },
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from the body into req.body
// and limit the data in 10kb
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'difficulty',
      'maxGroupSize',
      'price',
    ],
  })
);

// Test middle ware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes

app.use('/', viewRouter);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// has to in the end of routes
app.all('*', (req, res, next) => {
  next(new appErr(`Can't find ${req.originalUrl} on this server!`));
  // will skip all other middle ware and goes into error handler
});

app.use(globalErrHandler);

module.exports = app;
