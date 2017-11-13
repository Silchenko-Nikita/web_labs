let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let bcrypt = require('bcrypt-nodejs');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

let index = require('./routes/index');
let books = require('./routes/books');
let users = require('./routes/users');

let app = express();

let User = users.User;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

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
app.use('/', users);
app.use(express.static(path.join(__dirname, 'public')));


// визначає, яку інформацію зберігати у Cookie сесії
passport.serializeUser(function(user, done) {
  // наприклад, зберегти у Cookie сесії id користувача
  done(null, user.id);
});


// отримує інформацію (id) із Cookie сесії і шукає користувача, що їй відповідає
passport.deserializeUser(function(id, done) {
  User.findOne({_id: id}, function(err, user) {

    done(null, user.id);
  });
});

// налаштування стратегії для визначення користувача, що виконує логін
// на основі його username та password
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'pass'
  }, (username, password, done) => {
  User.findOne({ username: username }, function (err, user) {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!users.validPassword(password, user)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  });
}));


app.use(passport.initialize());
app.use(passport.session());

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
module.exports.passport = passport;
