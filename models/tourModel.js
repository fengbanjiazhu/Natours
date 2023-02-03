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
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
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

// Document Middleware : runs before .save() and .create()
tourSchema.pre('save', function (next) {
  // this -- is current processing document
  // console.log(this) -- {name : ...  slug:NA}
  this.slug = slugify(this.name, { lower: true });
  next();
});

// multi pre middleware could exist
tourSchema.pre('save', function (next) {
  console.log('will save document ...');
  next();
});

// Post middleware : runs after all pre middleware finished
tourSchema.post('save', function (doc, next) {
  // doc:  processed document
  // console.log(doc) -- {name : ...  slug:test-tour...}
  next();
});

// create something like an "ES6 class"
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
