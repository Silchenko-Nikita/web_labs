let express = require('express');
let mongoose = require('mongoose');
let passport = require('passport');
let passportLocalMongoose = require('passport-local-mongoose');
let bcrypt = require('bcrypt-nodejs');

function render(req, res, viewname, extra) {
  User.findOne({ _id: req.user }, function(err, user) {
    extra = extra || {};
    if (user) {
      extra.username = user.username;
    }
    res.render(viewname, extra);
  });
}

let router = express.Router();
mongoose.connect('mongodb://nikitos:funnycats@ds149855.mlab.com:49855/heroku_s1fzsv21', { useMongoClient: true });

const REGULAR_USER = 1;
const ADMIN_USER = 2;

let userSchema = new mongoose.Schema({
  username: String,
  pass: String,
  type: Number
});

userSchema.plugin(passportLocalMongoose);
let User = mongoose.model('user', userSchema);

// User.remove({}).then(x => console.log(x));
// User.find({}).then(x => console.log(x));
// let user = new User(
//   {
//     username: 'admin',
//     pass: generateHash('admin'),
//     type: ADMIN_USER
//   }
// );
// user.save();


// hash the password
function generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// checking if password is valid
function validPassword(password, user) {
  return bcrypt.compareSync(password, user.pass);
}


function checkAuth(req, res, next) {
  if (!req.user) return res.sendStatus(401); // 'Not authorized'
  next();  // пропускати далі тільки аутентифікованих
}


function checkAdmin(req, res, next) {
  User.findOne({ _id: req.user }, function(err, user) {
    if (!user) res.sendStatus(401); // 'Not authorized'
    else if (user.type !== ADMIN_USER) res.sendStatus(403); // 'Forbidden'
    next();  // пропускати далі тільки аутентифікованих із роллю 'admin'
  });
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/register', function(req, res, next) {

  let username = req.body.username;
  let pass = req.body.pass;
  let pass2 = req.body.pass2;

  if (pass.length < 5){
    res.render('register', { err: "Довжина паролю бути не меньша за 5" });
    return res;
  }

  if (username.length < 5){
    res.render('register', { err: "Довжина нікнейму бути не меньша за 5" });
    return res;
  }

  if (pass !== pass2){
    res.render('register', { err: "Паролі не співпадають" });
    return res;
  }

  if (!username.match(/^[a-zA-Z0-9]*$/g)){
    res.render('register', { err: "Нікнейм повинен складатися лише з букв і цифр" });
    return res;
  }

  if (!pass.match(/^[a-zA-Z0-9]*$/g)){
    res.render('register', { err: "Пароль повинен складатися лише з букв і цифр" });
    return res;
  }

  User.findOne({username: req.body.username}, function(err, user) {
    res.render('register', { err: "Даний нікнейм вже використовується" });
    return res;
  });

  let new_user = new User({
    username: username,
    type: REGULAR_USER,
    pass: generateHash(pass)
  });

  // new_user.pass = generateHash(pass);
  new_user.save();

  res.redirect('/login');
});


router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),  function(req, res) {

  User.findOne( { username: req.body.username }, function(err, user) {
    if (!user){
      res.render('login', { err: "Такий користувач не знайдений" });
    }


    if (validPassword(req.body.pass, user)) {
      res.redirect('/');
    } else {
      res.render('login', { err: "Пароль неправильний" });
    }
  });
});


router.get('/logout',
  (req, res) => {
    req.logout();
    res.redirect('/');
  });


router.get('/users', checkAdmin, function(req, res, next) {
  User.find({}, function(err, users) {
    render(req, res, 'users', { users: users });
  });
});

module.exports = router;
module.exports.User = User;
module.exports.validPassword = validPassword;
module.exports.checkAuth = checkAuth;
module.exports.checkAdmin = checkAdmin;
module.exports.render = render;
