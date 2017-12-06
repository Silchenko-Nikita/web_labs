let express = require('express');
let router = express.Router();

let fs = require('fs');

let books_db = require('../db/books');
let utils = require('../utils');

let render = utils.render;
const objsPerPage = 5;

/* GET home page. */
router.get('/books', utils.checkAuth, function(req, res, next) {
  books_db.find({}, {_id: 1}).then( books => {
    let search = req.query.search || '';
    let page = parseInt(req.query.p) || 0;

    if (search) {
      books = books.filter(book => book['name'].toLowerCase().includes(search.toLowerCase()));
    }

    let has_prev_page = false, has_next_page = false;

    if (page < 0){
      books = [];
      has_next_page = true;

    } else {
      let begin = page * objsPerPage;
      let end = Math.min((page + 1) * objsPerPage, books.length);
      has_prev_page = begin > 0;
      has_next_page = end < books.length;

      books = books.slice(begin, end);
    }

    render(req, res, 'books', { books: books, search: search, page: page,
        has_prev_page: has_prev_page, has_next_page: has_next_page });
  });
});


router.get('/books/add', utils.checkAuth, function(req, res, next) {
  render(req, res, 'add_book');
});


router.get('/books/:_id', utils.checkAuth, function(req, res, next) {

  books_db.getById(req.params._id).then( book =>{
    if (book){
      render(req, res, 'book', { book: book });
    } else {
      res.status(404).send('Not found');
    }})
    .catch(err => {
      res.send('Some error occurred');
    });
});

router.post('/books/add', utils.booksImgUpload, function(req, res, next) {
  let user = req.user;
  let username = null;
  if (user) {
    username = user.username;
  }

  let img = req.file;

  if (!img){
    render(req, res, 'add_book', { err: "Файл зображення повинен бути присутнім та мати формат jpg, png або jpeg" });
    return res
  }

  let books = books_db.getAll().then(function (books) {

    // if (new Date(req.body.pub_date) > new Date()){
    //   res.render('add_book', { err: "Дата повинна бути не більша за сьогоднішню" });
    // }

    let new_book = {
      "tag": img.filename.split(".")[0],
      "name": req.body.name,
      "author": req.body.author,
      "rating": parseInt(req.body.rating),
      "descr": req.body.descr,
      "likes_num":  parseInt(req.body.likes_num),
      "dislikes_num":  parseInt(req.body.dislikes_num),
      "pub_date": req.body.pub_date
    };

    books_db.create(new_book).then(function (result) {
      let msg = 'Книга "' + new_book['name'] + '" була успішно додана';
      render(req, res, 'msg', { msg:  msg });
      return res
    }).catch(function (err) {
      render(req, res, 'add_book', { err: err.message });
      return res
    });
  });
});


router.post('/books/:_id/delete', utils.checkAuth, function(req, res, next) {
  let user = req.user;
  let username = null;
  if (user) {
    username = user.username;
  }

  books_db.getById(req.params._id).then( book => {
    books_db.remove(req.params._id).then(r => {
      let msg = 'Книга "' + book['name'] + '" була успішно видалена';
      render(req, res, 'msg', {msg: msg});
      return res
    })
  })
});


module.exports = router;