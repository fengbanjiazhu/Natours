const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

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

// Server
const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`app running on ${port}...`);
});

// test  debugger