const express = require('express');
const passport = require('passport');

const configs = require('../configs');
const utils = require('../utils');
const users_db = require('../db/users');

let User = users_db.User;
const REGULAR_USER = users_db.REGULAR_USER;
const ADMIN_USER = users_db.ADMIN_USER;

let render = utils.render;
let router = express.Router();

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
    pass: utils.generateHash(pass)
  });

  new_user.save();

  res.redirect('/login');
});


router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),  function(req, res) {

  User.findOne( { username: req.body.username }, function(err, user) {
    if (!user){
      res.render('login', { err: "Такий користувач не знайдений" });
    }


    if (utils.validPassword(req.body.pass, user)) {
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


router.get('/users', utils.checkAdmin, function(req, res, next) {
  User.find({}, function(err, users) {
    render(req, res, 'users', { users: users });
  });
});

module.exports = router;
