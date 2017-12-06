const express = require('express');
const config = require('../../../configs');
const utils = require('../../../utils');
const users_db = require('../../../db/users');
const auth = require('../../../auth');

const router = express.Router();

router.use(auth.adminBasicAuth);


/**
 * @api {get} /users Повернути користовачів
 * @apiSampleRequest /api/v1/users
 * @apiName GetUsers
 * @apiGroup Users
 * @apiPermission admin
 *
 * @apiHeader Authorization Basic Access Authentication token
 * @apiHeader Content-Type application/json
 *
 * @apiParam {Integer} p Сторінка результату (дефолт: 0)
 *
 * @apiSuccess {Array} entities Масив користувачів
 * @apiSuccess {Number} total_entities_num Загальна кілкість сутностей
 * @apiSuccess {Number} entities_per_page Сутностей на сторінці
 * @apiSuccess {Number} page Індекс сторінки
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 Success
 * {
 *  "entities": [
 *      {
 *          "_id": "5a257f7d25476c421e88635d",
 *          "username": "admin",
 *          "type": "admin",
 *          "pass": "$2a$08$siSH7ztyEhpCylhlmWJnhOVuune0QWTKjwFKkjGTQgCS4M0zKHsZO"
 *      },
 *      {
 *          "_id": "5a257fe73c4b19422aa994ff",
 *          "username": "nikitos",
 *          "type": "regular",
 *          "pass": "$2a$08$O4fBy.0xE79C0zMfH0J/ouCnMYbWIVqL71bp0h4McoRjWxvL4vBKS"
 *      }
 *  ],
 *  "total_entities_num": 2,
 *  "entities_per_page": 5,
 *  "page": 0
 * }
 * @apiError NotAuthorized Неправильні дані користувача або користувач не є адміном
 * @apiErrorExample NotAuthorized
 * HTTP/1.1 401 NotAuthorized
 * {
 *  "status": "Неправильні дані користувача або користувач не є адміном"*
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

  users_db.findAndCount(req.query, {'_id': 1}, page * config.apiObjsPerPage, config.apiObjsPerPage).then(data => {
    res.json({
      entities: data.entities,
      total_entities_num: data.num,
      entities_per_page: config.apiObjsPerPage,
      page: page,
    });
  }).catch(e => {
    res.json({
      entities: [],
      total_entities_num: 0,
      entities_per_page: config.apiObjsPerPage,
      page: page,
    });
  })
});

/**
 * @api {get} /users/:_id Отримати користувача по id
 * @apiSampleRequest /api/v1/users/5a257f7d25476c421e88635d
 * @apiName GetUserById
 * @apiGroup Users
 * @apiPermission admin
 *
 * @apiHeader Authorization Basic Access Authentication token
 * @apiHeader Content-Type application/json
 *
 * @apiSuccess {Object} _ Отриманий користувач
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 * {
 *  "_id": "5a257f7d25476c421e88635d",
 *  "username": "admin",
 *  "type": "admin",
 *  "pass": "$2a$08$siSH7ztyEhpCylhlmWJnhOVuune0QWTKjwFKkjGTQgCS4M0zKHsZO"
 * }
 * @apiError NotAuthorized Неправильні дані користувача або користувач не є адміном
 * @apiErrorExample NotAuthorized
 * HTTP/1.1 401 NotAuthorized
 * {
 *  "status": "Неправильні дані користувача або користувач не є адміном"*
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
  users_db.getById(req.params._id).then( user => {
    if (user){
      res.json(user);
    } else {
      res.status(404).json({'status': 'Не знайдено'});
    }
  });
});

/**
 * @api {delete} /users/:_id Видалити користувача
 * @apiSampleRequest /api/v1/users/5a257f7d25476c421e88635d
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiPermission admin
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
 * @apiError NotAuthorized Неправильні дані користувача або користувач не є адміном
 * @apiErrorExample NotAuthorized
 * HTTP/1.1 401 NotAuthorized
 * {
 *  "status": "Неправильні дані користувача або користувач не є адміном"*
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
  users_db.getById(req.params._id).then( user => {
    if (!user){
      res.status(404).json({'status': 'Не знайдено'});
      return res
    }
    User.remove({ _id: _id }).then( r => {
      res.json({'status': 'deleted', 'entity': user });
    })
  })
});

module.exports = router;