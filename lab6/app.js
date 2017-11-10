let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let bcrypt = require('bcrypt-nodejs');
let mongoose = require('mongoose');
const passport = require('passport');

let index = require('./routes/index');
let books = require('./routes/books');
let users = require('./routes/users');

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://nikitos:funnycats@ds149855.mlab.com:49855/heroku_s1fzsv21', { useMongoClient: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', books);
app.use('/b', books);
app.get('/books/garry_potter',function(req,res){
    res.sendFile(path.join(__dirname, 'views', 'books/garry_potter.html'));

});
app.get('/books/don_kihot',function(req,res){
    res.sendFile(path.join(__dirname, 'views', 'books/don_kihot.html'));

});
app.get('/books/sample_book',function(req,res){
    res.sendFile(path.join(__dirname, 'views', 'books/sample.html'));

});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
module.passport = passport;
