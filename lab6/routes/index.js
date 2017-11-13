let express = require('express');
let router = express.Router();
let users = require('./users');
let bodyParser = require("body-parser");
let User = users.User;

/* GET home page. */
router.get('/', function(req, res, next) {

  User.findOne({ _id: req.user }, function(err, user) {
    let username = null;
    if (user) {
      username = user.username;
    }
    res.render('index', { username : username });
  });
});

module.exports = router;
