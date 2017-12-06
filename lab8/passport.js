let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let users_db = require('./db/users');
let utils = require('./utils');
let User = users_db.User;

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
    if (!utils.validPassword(password, user)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  });
}));

module.exports = passport;