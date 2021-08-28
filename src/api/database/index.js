const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Cookmaster', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }).then(() => {
    console.log('Database/index.js DB connected !');
  }).catch((err) => {
    console.log(`Database/index.js error connecting to DB! ${err}`);
  });

mongoose.Promise = global.Promise;

module.exports = mongoose;