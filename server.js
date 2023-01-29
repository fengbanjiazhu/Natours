const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

// console.log(process.env);

// Server
const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`app running on ${port}...`);
});
