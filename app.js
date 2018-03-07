var express = require('express');
//var debug = require('debug')('express debug:server');
var app = express();

var mongoose = require('mongoose');
var config = require('./config');
var logger = require('morgan');

var port = process.env.PORT || 3020;

var apiController = require('./controllers/apiController');

app.use(logger('dev'));
app.use('/assets', express.static(`${__dirname}/uploads`));

app.set('view-engine', 'ejs');

mongoose.connect(config.getDbConnStr());

apiController(app);

app.listen(port, () => {
  console.log("Server is up...");
});