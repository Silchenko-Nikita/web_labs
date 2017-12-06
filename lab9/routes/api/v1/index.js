const express = require('express');
const router = express.Router();

router.use('/books', require('./books'));
router.use('/users', require('./users'));

router.use(function(req, res) {
  res.status(404).json({'status': 'Не знайдено'});
});

router.use(function(err, req, res, next) {
  res.status(500).json({'status': 'Помилка на сервері'});
});

module.exports = router;