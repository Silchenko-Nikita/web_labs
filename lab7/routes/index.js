let express = require('express');
let router = express.Router();

let utils = require('../utils');
let books = require('./books');
let users = require('./users');
let api = require('./api');

let bodyParser = require("body-parser");

/* GET home page. */
router.get('/', function(req, res, next) {
  utils.render(req, res, 'index');
});

router.use('/', books);
router.use('/', users);
router.use('/api', api);

// catch 404 and forward to error handler
router.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
router.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = router;
