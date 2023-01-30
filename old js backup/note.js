const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// mongoose.connect()  -- connect the server and nodejs
// pass in Link(DB) and options
mongoose
  .connect(DB, {
    // some options
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));

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

// create an instance of Tour class
const testTour = new Tour({
  name: 'The Park Camper',
  price: 997,
});

// push / save the instance to server
// it will return a promise, use .then() & .catch()
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('error', err);
  });
