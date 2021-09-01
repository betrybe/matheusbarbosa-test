const mongoose = require('mongoose');

mongoose.connect('mongodb://mongodb:27017/Cookmaster', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, 
  });

mongoose.Promise = global.Promise;

module.exports = mongoose;