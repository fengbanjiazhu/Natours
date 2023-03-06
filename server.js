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
  .then(() => console.log('DB connection successful'))
  .catch((err) => console.log('ERROR'));

// Server
const port = 3000 || process.env.PORT;

const server = app.listen(port, () => {
  console.log(`app running on ${port}...`);
});

// listen all other un handled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);

  // if we really have some problems, shut down the app
  server.close(() => {
    process.exit(1);
    // 0 => success, 1 => un-captured problem
  });
});
