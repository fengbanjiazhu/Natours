const app = require('./app');
// Server
const port = 3000;
app.listen(port, () => {
  console.log(`app running on ${port}...`);
});
