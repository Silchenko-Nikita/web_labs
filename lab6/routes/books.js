let express = require('express');
let books_utils = require('../books');
let router = express.Router();
let fs = require('fs');
let multer = require('multer');
let users = require('./users');
let User = users.User;
let render = users.render;
const books_images_dir = 'public/images/books';

/* GET home page. */
router.get('/books', users.checkAuth, function(req, res, next) {
  books_utils.getAll().then( books => {
    let search = req.query.search || '';
    let page = parseInt(req.query.p) || 0;
    let obj_per_page = 3;

    if (search) {
      books = books.filter(book => book['name'].toLowerCase().includes(search.toLowerCase()));
    }

    let has_prev_page = false, has_next_page = false;

    if (page < 0){
      books = [];
      has_next_page = true;

    } else {
      let begin = page * obj_per_page;
      let end = Math.min((page + 1) * obj_per_page, books.length);
      has_prev_page = begin > 0;
      has_next_page = end < books.length;

      books = books.slice(begin, end);
    }

    render(req, res, 'books', { books: books, search: search, page: page,
        has_prev_page: has_prev_page, has_next_page: has_next_page });
  });
});


router.get('/books/add', users.checkAuth, function(req, res, next) {
  render(req, res, 'add_book', {});
});


router.get('/books/:id', users.checkAuth, function(req, res, next) {

  books_utils.getById(parseInt(req.params.id)).then( book =>{
    if (book){

      render(req, res, 'book', { book: book, book_id: req.params.id });
    } else {
      res.status(404).send('Not found');
    }})
    .catch(err => {
      res.send('Some error occurred');
    });
});


let imgs_storage = multer.diskStorage({
  destination: books_images_dir,
  filename: function (req, file, callback) {
    callback(null,  file.originalname.split(".")[0].replace(/\W+/g, '-') + Date.now() + '.jpg');
  }
});


function imgsFilter(req, file, callback) {
  let original_format = file.originalname.split(".").slice(-1)[0].toLowerCase();
  if (original_format === 'jpg' || original_format  === 'png' || original_format === 'jpeg') return callback(null, true);
  return callback(null, false);
}

let img_upload = multer({storage: imgs_storage, fileFilter: imgsFilter}).single('img');

router.post('/books/add', img_upload, function(req, res, next) {
  let user = req.user;
  let username = null;
  if (user) {
    username = user.username;
  }

  let img = req.file;

  if (!img){
    render(req, res, 'add_book', { err: "Файл повинен мати формати jpg, png або jpeg" });
    return res
  }

  let books = books_utils.getAll().then(function (books) {
    let id = 0;
    if (books){
      for (let book of books){
        if (book['id'] > id){
          id = book['id'];
        }
      }
      id++;
    }

    if (id === 0){
      render(req, res, 'add_book', { err: "Виникла помилка на сервері" });
      return res
    }

    // if (new Date(req.body.pub_date) > new Date()){
    //   res.render('add_book', { err: "Дата повинна бути не більша за сьогоднішню" });
    // }

    let new_book = {
      "id": id,
      "tag": img.filename.split(".")[0],
      "name": req.body.name,
      "author": req.body.author,
      "rating": parseInt(req.body.rating),
      "descr": req.body.descr,
      "likes_num":  parseInt(req.body.likes_num),
      "dislikes_num":  parseInt(req.body.dislikes_num),
      "pub_date": req.body.pub_date
    };

    books_utils.create(new_book).then(function (result) {
      if (result === 1){
        render(req, res, 'add_book', { err: "Неправильні дані" });
        return res
      } else {
        let msg = 'Книга "' + new_book['name'] + '" була успішно додана';
        render(req, res, 'msg', { msg:  msg });
        return res
      }
    }).catch(function (err) {
      render(req, res, 'add_book', { err: "Виникла помилка на сервері" });
      return res
    });
  });
});


router.post('/books/:id/delete', users.checkAuth, function(req, res, next) {
  let user = req.user;
  let username = null;
  if (user) {
    username = user.username;
  }

  books_utils.remove(parseInt(req.params.id)).then( book =>{
    let msg = 'Книга "' + book['name'] + '" була успішно видалена';
    render(req, res, 'msg', { msg:  msg });
    return res
  })
});


module.exports = router;
