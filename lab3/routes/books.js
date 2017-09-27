var express = require('express');
var books_utils = require('../books');
var router = express.Router();

/* GET home page. */
router.get('/books', function(req, res, next) {
  books_utils.getAll().then( books =>
  res.render('books', { books: books }));
});

router.get('/books/:id', function(req, res, next) {
  books_utils.getById(parseInt(req.params.id)).then( book =>{
      if (book){
          res.render('book', { book: book });
      } else {
          res.status(404).send('Not found');
      }})
      .catch(err => {
          res.send('Some error occurred');
      });
});

module.exports = router;
