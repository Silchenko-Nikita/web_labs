let express = require('express');
let router = express.Router();

let utils = require('../utils');
let books = require('./books');
let users = require('./users');
let api = require('./api');

let render = utils.render;

let bodyParser = require("body-parser");

/* GET home page. */
router.get('/', function(req, res, next) {
  utils.render(req, res, 'index');
});

router.use('/', books);
router.use('/', users);
router.use('/api', api);

router.use(function(req, res, next) {
  render(req, res, 'msg', {msg: 'Помилка 404: Ресурс не знайдений'});
});

router.use(function(err, req, res, next) {
  render(req, res, 'msg', {msg: 'Помилка 500: Несправність на сервері'});
});

module.exports = router;
