const mongoose = require('mongoose');

// create a new schema
// states out required or not, has default value or not, etc
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// create something like an "ES6 class"
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
