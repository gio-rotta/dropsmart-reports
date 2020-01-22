'use strict'

const config = require('config');
const mongoose = require('mongoose');

mongoose.connect(config.server.db.uri);

mongoose.connection.on('error', function(err) {
  console.log('Mongoose default connection error: ' + err);
  process.exit(1);
});

mongoose.connection.on('open', function(err) {
  console.log('Mongoose is connected!');
});
