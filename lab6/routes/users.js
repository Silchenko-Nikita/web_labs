let express = require('express');
let router = express.Router();
let passport = express.passport;


const REGULAR_USER = 1;
const ADMIN_USER = 2;

let userSchema = new mongoose.Schema({
  username: String,
  pass: String,
  type: Number
});

let User = mongoose.model('user', userSchema);


// визначає, яку інформацію зберігати у Cookie сесії
passport.serializeUser(function(user, done) {
  // наприклад, зберегти у Cookie сесії id користувача
  done(null, user._id);
});

// отримує інформацію (id) із Cookie сесії і шукає користувача, що їй відповідає
passport.deserializeUser(function(id, done) {
  User.findOne({id: id}, function(err, user) {

    done(null, user._id);

  });
});

// налаштування стратегії для визначення користувача, що виконує логін
// на основі його username та password
passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({username: username, pass: password }, function(err, user) {

    done(null, user._id);

  });
}));


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
  if (!req.user) res.sendStatus(401); // 'Not authorized'
  else if (req.user.role !== 'admin') res.sendStatus(403); // 'Forbidden'
  else next();  // пропускати далі тільки аутентифікованих із роллю 'admin'
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

  if (pass !== pass2){
    res.render('register', { err: "Паролі не співпадають" });
    return res;
  }

  let new_user = new User({
    username: username,
    type: REGULAR_USER
  });

  new_user.pass = generateHash(pass);
  new_user.save();
  console.log(new_user);

  res.redirect('/');
});


router.post('/login', passport.authenticate('local', { failureRedirect: '/' }), function(req, res) {
  User.findOne({username: req.body.username}, function(err, user) {

    if (!validPassword(req.body.pass, user)) {
      console.log(user);
    } else {
      console.log(user);
    }
  });
});


app.get('/logout',
  (req, res) => {
    req.logout();
    res.redirect('/');
  });

module.exports = router;
