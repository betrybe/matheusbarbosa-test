const mongoose = require('mongoose');

const mongoDbUrl = 'mongodb://mongodb:27017/Cookmaster';

mongoose.connect(mongoDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
mongoose.Promise = global.Promise;

module.exports = mongoose;