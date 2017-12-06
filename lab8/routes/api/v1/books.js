const express = require('express');

const configs = require('../../../configs');
const utils = require('../../../utils');
const books_db = require('../../../db/books');
const auth = require('../../../auth');

const router = express.Router();

router.use(auth.genericBasicAuth);

/**
* @api {get} /books Повернути книги
* @apiSampleRequest /api/v1/books
* @apiName GetBooks
* @apiGroup Books
* @apiPermission regular
*
* @apiHeader Authorization Basic Access Authentication token
* @apiHeader Content-Type application/json
*
* @apiParam {Integer} p Сторінка результату (дефолт: 0)
* @apiParam {String} _id Пошук за ідентифікатором
* @apiParam {String} tag Пошук за тегом
* @apiParam {String} name Пошук за назвою (за назвою шукається за принципом "включення")
* @apiParam {String} author Пошук за атвором
* @apiParam {Integer} rating Пошук за рейтингом
* @apiParam {Integer} likes_num Пошук за кількістю лайків
* @apiParam {Integer} dislikes_num Пошук за кількістю дізлайків
* @apiParam {String} pub_date Пошук за датою
*
* @apiSuccess {Array} entities Масив книг
* @apiSuccess {Number} total_entities_num Загальна кілкість сутностей
* @apiSuccess {Number} entities_per_page Сутностей на сторінці
* @apiSuccess {Number} page Індекс сторінки
* @apiSuccessExample Success-Response
* HTTP/1.1 200 Success
* {
*  "entities": [
*    {
*      "_id": "5a256f4750e3b1355b2c3e2e",
*      "tag": "don_kihot",
*      "name": "Дон Кіхот",
*      "author": "Мігель де Сервантес Сааведра",
*      "rating": 4,
*      "descr": "Роман іспанського письменника Мігеля де Сервантеса Сааведра. Головний герой так любить читати лицарські романи, що вирішує податися на пошуки пригод як мандрівний лицар.",
*      "likes_num": 21,
*      "dislikes_num": 2,
*      "pub_date": "1523-09-26",
*      "img": "localhost:3000/images/books/don_kihot.jpg"
*    },
*      ...
*  ],
*  "total_entities_num": 8,
*  "entities_per_page": 5,
*  "page": 0
* }
* @apiError NotAuthorized Неправильні дані користувача
* @apiErrorExample NotAuthorized
* HTTP/1.1 401 NotAuthorized
* {
*  "status": "Неправильні дані користувача"*
* }
* @apiError ServerError Виникла помилка на сервері
* @apiErrorExample ServerError
* HTTP/1.1 500 ServerError
* {
*  "status": "Помилка на сервері"
* }
*/
router.get('', function (req, res) {
  const page = parseInt(req.query.p) || 0;
  delete req.query.p;

  let filter = req.query;
  if (filter.name) {
    filter.name = { "$regex": filter.name, "$options": "i" };
  }
  books_db.findAndCount(filter, {'_id': 1},
    page * configs.apiObjsPerPage, configs.apiObjsPerPage).then(data => {

    let entities = [];

    for (let i = 0; i < data.entities.length; i++){
      let entity = utils.getBookWithImgField(req, data.entities[i]);
      entities.push(entity);
    }

    res.json({
      entities: entities,
      total_entities_num: data.num,
      entities_per_page: configs.apiObjsPerPage,
      page: page,
    });
  }).catch(e => {
    res.json({
      entities: [],
      total_entities_num: 0,
      entities_per_page: configs.apiObjsPerPage,
      page: page,
    });
  })
});

/**
 * @api {get} /books/:_id Отримати книгу по id
 * @apiSampleRequest /api/v1/books/5a256f4750e3b1355b2c3e2e
 * @apiName GetBookById
 * @apiGroup Books
 * @apiPermission regular
 *
 * @apiHeader Authorization Basic Access Authentication token
 * @apiHeader Content-Type application/json
 *
 * @apiSuccess {Object} _ Отримана книга
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 * {
 *  "_id": "5a256f4750e3b1355b2c3e2e",
 *  "tag": "don_kihot",
 *  "name": "Дон Кіхот",
 *  "author": "Мігель де Сервантес Сааведра",
 *  "rating": 4,
 *  "descr": "Роман іспанського письменника Мігеля де Сервантеса Сааведра. Головний герой так любить читати лицарські романи, що вирішує податися на пошуки пригод як мандрівний лицар.",
 *  "likes_num": 21,
 *  "dislikes_num": 2,
 *  "pub_date": "1523-09-26",
 *  "img": "localhost:3000/images/books/don_kihot.jpg"
 * }
 * @apiError NotAuthorized Неправильні дані користувача
 * @apiErrorExample NotAuthorized
 * HTTP/1.1 401 NotAuthorized
 * {
 *  "status": "Неправильні дані користувача"*
 * }
 * @apiError NotFound Не має відповідного ресурсу
 * @apiErrorExample NotFound
 * HTTP/1.1 404 NotFound
 * {
 *  "status": "Не знайдено"
 * }
 * @apiError ServerError Виникла помилка на сервері
 * @apiErrorExample ServerError
 * HTTP/1.1 500 ServerError
 * {
 *  "status": "Помилка на сервері"
 * }
 */
router.get('/:_id', function (req, res) {
  books_db.getById(req.params._id).then( book => {
    if (book){
      res.json(utils.getBookWithImgField(req, book));
    } else {
      res.status(404).json({'status': 'Не знайдено'});
    }
  });
});

/**
 * @api {patch} /books/:_id Оновити книгу
 * @apiSampleRequest /api/v1/books/5a256f4750e3b1355b2c3e2e
 * @apiName UpdateBook
 * @apiGroup Books
 * @apiPermission regular
 *
 * @apiHeader Authorization Basic Access Authentication token
 * @apiHeader Content-Type application/json
 *
 * @apiParam {String} tag Тег (має відповідати тегу збереженого зображення і бути унікальним)
 * @apiParam {String} name Назва
 * @apiParam {String} author Автор
 * @apiParam {Integer} rating Рейтинг
 * @apiParam {Integer} likes_num Кількість лайків
 * @apiParam {Integer} dislikes_num Кількість дізлайків
 * @apiParam {Integer} descr Опис книги
 * @apiParam {String} pub_date Дата створення
 *
 * @apiSuccess {Object} _ Оновлений об'єкт
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 * {
 *  "tag": "stack1512399565452",
 *  "name": "Дон Кіхот",
 *  "author": "Мігель де dasdsa",
 *  "rating": 4,
 *  "descr": "Роман іспанського письменника Мігеля де Сервантеса Сааведра. Головний герой так любить читати лицарські романи, що вирішує податися на пошуки пригод як мандрівний лицар.",
 *  "likes_num": 21,
 *  "dislikes_num": 2,
 *  "pub_date": "1523-09-26",
 *  "_id": "5a26e56f9b23c319aa6cae69",
 *  "img": "localhost:3000/images/books/stack1512399565452.jpg"
 * }
 *
 * @apiError NotAuthorized Неправильні дані користувача
 * @apiErrorExample NotAuthorized
 * HTTP/1.1 401 NotAuthorized
 * {
 *  "status": "Неправильні дані користувача"*
 * }
 * @apiError NotFound Не має відповідного ресурсу
 * @apiErrorExample NotFound
 * HTTP/1.1 404 NotFound
 * {
 *  "status": "Не знайдено"
 * }
 * @apiError ServerError Виникла помилка на сервері
 * @apiErrorExample ServerError
 * HTTP/1.1 500 ServerError
 * {
 *  "status": "Помилка на сервері"
 * }
 */
router.patch('/:_id', function (req, res) {
  books_db.update(req.params._id, req.body).then( book => {
    if (book){
      res.json(utils.getBookWithImgField(req, book));
    } else {
      res.status(404).json({'status': 'Не знайдено'});
    }
  }).catch( e => {
    res.status(400).json({'error': e.message});
  });
});


/**
 * @api {delete} /books/:_id Видалити книгу
 * @apiSampleRequest /api/v1/books/5a257f7d25476c421e88635d
 * @apiName DeleteBook
 * @apiGroup Books
 * @apiPermission regular
 *
 * @apiHeader Authorization Basic Access Authentication token
 * @apiHeader Content-Type application/json
 *
 * @apiSuccess {String} status "deleted" - статус видалення
 * @apiSuccess {Object} entity Видалений об'єкт
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 * {
 *   "status": "deleted",
 *   "entity": {
 *     "_id": "5a257f7d25476c421e88635d",
 *     "username": "admin",
 *     "type": "admin",
 *     "pass": "$2a$08$siSH7ztyEhpCylhlmWJnhOVuune0QWTKjwFKkjGTQgCS4M0zKHsZO"
 *   }
 * }
 *
 * @apiError NotAuthorized Неправильні дані користувача
 * @apiErrorExample NotAuthorized
 * HTTP/1.1 401 NotAuthorized
 * {
 *  "status": "Неправильні дані користувача"*
 * }
 * @apiError NotFound Не має відповідного ресурсу
 * @apiErrorExample NotFound
 * HTTP/1.1 404 NotFound
 * {
 *  "status": "Не знайдено"
 * }
 * @apiError ServerError Виникла помилка на сервері
 * @apiErrorExample ServerError
 * HTTP/1.1 500 ServerError
 * {
 *  "status": "Помилка на сервері"
 * }
 */
router.delete('/:_id', utils.booksImgUpload, function (req, res) {
  books_db.getById(req.params._id).then( book => {
    if (!book){
      res.status(404).json({'status': 'Не знайдено'});
      return res
    }
    books_db.remove(req.params._id).then( r => {
      res.json({'status': 'deleted', 'entity': utils.getBookWithImgField(req, book) });
    })
  })
});


/**
 * @api {post} /books Додати нову книгу
 * @apiSampleRequest /api/v1/books
 * @apiName AddBook
 * @apiGroup Books
 * @apiPermission regular
 *
 * @apiHeader Authorization Basic Access Authentication token
 * @apiHeader Content-Type application/json
 *
 * @apiParam {String} tag Тег (має відповідати тегу збереженого зображення і бути унікальним)
 * @apiParam {String} name Назва
 * @apiParam {String} author Автор
 * @apiParam {Integer} rating Рейтинг
 * @apiParam {Integer} likes_num Кількість лайків
 * @apiParam {Integer} dislikes_num Кількість дізлайків
 * @apiParam {Integer} descr Опис книги
 * @apiParam {String} pub_date Дата створення
 *
 * @apiSuccess {Object} _ Доданий об'єкт
 * @apiSuccessExample Success-Response
 * HTTP/1.1 201 OK
 * {
 *  "tag": "stack1512399565452",
 *  "name": "Дон Кіхот",
 *  "author": "Мігель де dasdsa",
 *  "rating": 4,
 *  "descr": "Роман іспанського письменника Мігеля де Сервантеса Сааведра. Головний герой так любить читати лицарські романи, що вирішує податися на пошуки пригод як мандрівний лицар.",
 *  "likes_num": 21,
 *  "dislikes_num": 2,
 *  "pub_date": "1523-09-26",
 *  "_id": "5a26e56f9b23c319aa6cae69",
 *  "img": "localhost:3000/images/books/stack1512399565452.jpg"
 * }
 *
 * @apiError NotAuthorized Неправильні дані користувача
 * @apiErrorExample NotAuthorized
 * HTTP/1.1 401 NotAuthorized
 * {
 *  "status": "Неправильні дані користувача"*
 * }
 * @apiError ServerError Виникла помилка на сервері
 * @apiErrorExample ServerError
 * HTTP/1.1 500 ServerError
 * {
 *  "status": "Помилка на сервері"
 * }
 */
router.post('', function (req, res) {
  books_db.create(req.body).then( book => {
    if (book){
      res.status(201).json(utils.getBookWithImgField(req, book));
    } else {
      res.status(404).send({'status': 'Не знайдено'});
    }
  }).catch( e => {
    res.status(400).json({'error': e.message});
  });
});

/**
 * @api {post} /books/images Додати нове зображення
 * @apiSampleRequest /api/v1/books/images
 * @apiName AddImg
 * @apiGroup Books
 * @apiPermission regular
 *
 * @apiHeader Authorization Basic Access Authentication token
 * @apiHeader Content-Type multipart/form-data
 *
 * @apiParam {File} img Файл зображення (допустимі формати: png, jpg, jpeg)
 *
 * @apiSuccess {String} tag Тег для використання при додаванні книги
 * @apiSuccessExample Success-Response
 * HTTP/1.1 201 OK
 * {
 *   "tag": "sample32187987312"
 * }
 *
 * @apiError NotAuthorized Неправильні дані користувача
 * @apiErrorExample NotAuthorized
 * HTTP/1.1 401 NotAuthorized
 * {
 *  "status": "Неправильні дані користувача"*
 * }
 * @apiError ServerError Виникла помилка на сервері
 * @apiErrorExample ServerError
 * HTTP/1.1 500 ServerError
 * {
 *  "status": "Помилка на сервері"
 * }
 */
router.post('/images', utils.booksImgUpload, function (req, res) {
  let img = req.file;

  if (!img){
    res.status(400).json({ 'error': "Файл зображення повинен бути присутнім та мати формат jpg, png або jpeg" });
    return res
  } else {
    res.status(201).json({ 'tag': img.filename.split(".")[0] });
  }
});

module.exports = router;