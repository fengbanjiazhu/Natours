const mongoose = require('mongoose');
const slugify = require('slugify');

// create a new schema
// states out required or not, has default value or not, etc
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must not more than 40 characters'],
      minlength: [10, 'A tour name must not less than 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty is either: easy, medium, or difficult',
      },
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this.  not working in updates
          // only works creating new element
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below the regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      // removes all space around the string
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    // a array with several strings
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual property
// will create a virtual property each time we use a get()
// can work with a callback func to deal with some data
// instead of setting many different datas
// exp: inch to meter
tourSchema.virtual('durationWeeks').get(function () {
  // can not use =>{}, we need this. keyword
  return this.duration / 7;
});

// --------------------------------------------------------
// Document Middleware : runs before .save() and .create()
tourSchema.pre('save', function (next) {
  // this -- is current processing document
  // console.log(this) -- {name : ...  slug:NA}
  this.slug = slugify(this.name, { lower: true });
  next();
});

// multi pre-middleware could exist
// tourSchema.pre('save', function (next) {
//   console.log('will save document ...');
//   next();
// });

// Post middleware : runs after all pre middleware finished
// tourSchema.post('save', function (doc, next) {
//   // doc:  processed document
//   // console.log(doc) -- {name : ...  slug:test-tour...}
//   next();
// });

// --------------------------------------------------------------
// QUERY middleware
// this -- query obj --not data
// tourSchema.pre('find', function (next) {}

// but if we have the ID search for secret tour, it still will show
// because findById => findOne, find => find
// so we use a regular expression
// to remove secret from all query start by find (findOne, findAll...)
tourSchema.pre(/^find/, function (next) {
  //$ne: not equal to
  //here means : query.find( secretTour : not true)
  //not showing the true secret tours
  this.find({ secretTour: { $ne: true } });
  // this.start = Date.now();
  next();
});

// docs => all datas found by query
// tourSchema.post(/^find/, function (docs, next) {
//   // console.log(`Query took: ${Date.now() - this.start} milliseconds`);
//   next();
// });

// --------------------------------------------------------------
// Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
  // remove secret tour in aggregate pipeline result
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// create something like an "ES6 class"
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
