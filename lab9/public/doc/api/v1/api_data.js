define({ "api": [
  {
    "type": "post",
    "url": "/books",
    "title": "Додати нову книгу",
    "sampleRequest": [
      {
        "url": "/api/v1/books"
      }
    ],
    "name": "AddBook",
    "group": "Books",
    "permission": [
      {
        "name": "regular"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Access Authentication token</p>"
          },
          {
            "group": "Header",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "tag",
            "description": "<p>Тег (має відповідати тегу збереженого зображення і бути унікальним)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Назва</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "author",
            "description": "<p>Автор</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "rating",
            "description": "<p>Рейтинг</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "likes_num",
            "description": "<p>Кількість лайків</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "dislikes_num",
            "description": "<p>Кількість дізлайків</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "descr",
            "description": "<p>Опис книги</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pub_date",
            "description": "<p>Дата створення</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "_",
            "description": "<p>Доданий об'єкт</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 201 OK\n{\n \"tag\": \"stack1512399565452\",\n \"name\": \"Дон Кіхот\",\n \"author\": \"Мігель де dasdsa\",\n \"rating\": 4,\n \"descr\": \"Роман іспанського письменника Мігеля де Сервантеса Сааведра. Головний герой так любить читати лицарські романи, що вирішує податися на пошуки пригод як мандрівний лицар.\",\n \"likes_num\": 21,\n \"dislikes_num\": 2,\n \"pub_date\": \"1523-09-26\",\n \"_id\": \"5a26e56f9b23c319aa6cae69\",\n \"img\": \"localhost:3000/images/books/stack1512399565452.jpg\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>Неправильні дані користувача</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Виникла помилка на сервері</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NotAuthorized",
          "content": "HTTP/1.1 401 NotAuthorized\n{\n \"status\": \"Неправильні дані користувача\"*\n}",
          "type": "json"
        },
        {
          "title": "ServerError",
          "content": "HTTP/1.1 500 ServerError\n{\n \"status\": \"Помилка на сервері\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/api/v1/books.js",
    "groupTitle": "Books"
  },
  {
    "type": "post",
    "url": "/books/images",
    "title": "Додати нове зображення",
    "sampleRequest": [
      {
        "url": "/api/v1/books/images"
      }
    ],
    "name": "AddImg",
    "group": "Books",
    "permission": [
      {
        "name": "regular"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Access Authentication token</p>"
          },
          {
            "group": "Header",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>multipart/form-data</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "img",
            "description": "<p>Файл зображення (допустимі формати: png, jpg, jpeg)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "tag",
            "description": "<p>Тег для використання при додаванні книги</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 201 OK\n{\n  \"tag\": \"sample32187987312\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>Неправильні дані користувача</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Виникла помилка на сервері</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NotAuthorized",
          "content": "HTTP/1.1 401 NotAuthorized\n{\n \"status\": \"Неправильні дані користувача\"*\n}",
          "type": "json"
        },
        {
          "title": "ServerError",
          "content": "HTTP/1.1 500 ServerError\n{\n \"status\": \"Помилка на сервері\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/api/v1/books.js",
    "groupTitle": "Books"
  },
  {
    "type": "delete",
    "url": "/books/:_id",
    "title": "Видалити книгу",
    "sampleRequest": [
      {
        "url": "/api/v1/books/5a257f7d25476c421e88635d"
      }
    ],
    "name": "DeleteBook",
    "group": "Books",
    "permission": [
      {
        "name": "regular"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Access Authentication token</p>"
          },
          {
            "group": "Header",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>&quot;deleted&quot; - статус видалення</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "entity",
            "description": "<p>Видалений об'єкт</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"deleted\",\n  \"entity\": {\n    \"_id\": \"5a257f7d25476c421e88635d\",\n    \"username\": \"admin\",\n    \"type\": \"admin\",\n    \"pass\": \"$2a$08$siSH7ztyEhpCylhlmWJnhOVuune0QWTKjwFKkjGTQgCS4M0zKHsZO\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>Неправильні дані користувача</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Не має відповідного ресурсу</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Виникла помилка на сервері</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NotAuthorized",
          "content": "HTTP/1.1 401 NotAuthorized\n{\n \"status\": \"Неправильні дані користувача\"*\n}",
          "type": "json"
        },
        {
          "title": "NotFound",
          "content": "HTTP/1.1 404 NotFound\n{\n \"status\": \"Не знайдено\"\n}",
          "type": "json"
        },
        {
          "title": "ServerError",
          "content": "HTTP/1.1 500 ServerError\n{\n \"status\": \"Помилка на сервері\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/api/v1/books.js",
    "groupTitle": "Books"
  },
  {
    "type": "get",
    "url": "/books/:_id",
    "title": "Отримати книгу по id",
    "sampleRequest": [
      {
        "url": "/api/v1/books/5a256f4750e3b1355b2c3e2e"
      }
    ],
    "name": "GetBookById",
    "group": "Books",
    "permission": [
      {
        "name": "regular"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Access Authentication token</p>"
          },
          {
            "group": "Header",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "_",
            "description": "<p>Отримана книга</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n \"_id\": \"5a256f4750e3b1355b2c3e2e\",\n \"tag\": \"don_kihot\",\n \"name\": \"Дон Кіхот\",\n \"author\": \"Мігель де Сервантес Сааведра\",\n \"rating\": 4,\n \"descr\": \"Роман іспанського письменника Мігеля де Сервантеса Сааведра. Головний герой так любить читати лицарські романи, що вирішує податися на пошуки пригод як мандрівний лицар.\",\n \"likes_num\": 21,\n \"dislikes_num\": 2,\n \"pub_date\": \"1523-09-26\",\n \"img\": \"localhost:3000/images/books/don_kihot.jpg\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>Неправильні дані користувача</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Не має відповідного ресурсу</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Виникла помилка на сервері</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NotAuthorized",
          "content": "HTTP/1.1 401 NotAuthorized\n{\n \"status\": \"Неправильні дані користувача\"*\n}",
          "type": "json"
        },
        {
          "title": "NotFound",
          "content": "HTTP/1.1 404 NotFound\n{\n \"status\": \"Не знайдено\"\n}",
          "type": "json"
        },
        {
          "title": "ServerError",
          "content": "HTTP/1.1 500 ServerError\n{\n \"status\": \"Помилка на сервері\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/api/v1/books.js",
    "groupTitle": "Books"
  },
  {
    "type": "get",
    "url": "/books",
    "title": "Повернути книги",
    "sampleRequest": [
      {
        "url": "/api/v1/books"
      }
    ],
    "name": "GetBooks",
    "group": "Books",
    "permission": [
      {
        "name": "regular"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Access Authentication token</p>"
          },
          {
            "group": "Header",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "p",
            "description": "<p>Сторінка результату (дефолт: 0)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Пошук за ідентифікатором</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "tag",
            "description": "<p>Пошук за тегом</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Пошук за назвою (за назвою шукається за принципом &quot;включення&quot;)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "author",
            "description": "<p>Пошук за атвором</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "rating",
            "description": "<p>Пошук за рейтингом</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "likes_num",
            "description": "<p>Пошук за кількістю лайків</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "dislikes_num",
            "description": "<p>Пошук за кількістю дізлайків</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pub_date",
            "description": "<p>Пошук за датою</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "entities",
            "description": "<p>Масив книг</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "total_entities_num",
            "description": "<p>Загальна кілкість сутностей</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "entities_per_page",
            "description": "<p>Сутностей на сторінці</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>Індекс сторінки</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 Success\n{\n \"entities\": [\n   {\n     \"_id\": \"5a256f4750e3b1355b2c3e2e\",\n     \"tag\": \"don_kihot\",\n     \"name\": \"Дон Кіхот\",\n     \"author\": \"Мігель де Сервантес Сааведра\",\n     \"rating\": 4,\n     \"descr\": \"Роман іспанського письменника Мігеля де Сервантеса Сааведра. Головний герой так любить читати лицарські романи, що вирішує податися на пошуки пригод як мандрівний лицар.\",\n     \"likes_num\": 21,\n     \"dislikes_num\": 2,\n     \"pub_date\": \"1523-09-26\",\n     \"img\": \"localhost:3000/images/books/don_kihot.jpg\"\n   },\n     ...\n ],\n \"total_entities_num\": 8,\n \"entities_per_page\": 5,\n \"page\": 0\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>Неправильні дані користувача</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Виникла помилка на сервері</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NotAuthorized",
          "content": "HTTP/1.1 401 NotAuthorized\n{\n \"status\": \"Неправильні дані користувача\"*\n}",
          "type": "json"
        },
        {
          "title": "ServerError",
          "content": "HTTP/1.1 500 ServerError\n{\n \"status\": \"Помилка на сервері\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/api/v1/books.js",
    "groupTitle": "Books"
  },
  {
    "type": "patch",
    "url": "/books/:_id",
    "title": "Оновити книгу",
    "sampleRequest": [
      {
        "url": "/api/v1/books/5a256f4750e3b1355b2c3e2e"
      }
    ],
    "name": "UpdateBook",
    "group": "Books",
    "permission": [
      {
        "name": "regular"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Access Authentication token</p>"
          },
          {
            "group": "Header",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "tag",
            "description": "<p>Тег (має відповідати тегу збереженого зображення і бути унікальним)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Назва</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "author",
            "description": "<p>Автор</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "rating",
            "description": "<p>Рейтинг</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "likes_num",
            "description": "<p>Кількість лайків</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "dislikes_num",
            "description": "<p>Кількість дізлайків</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "descr",
            "description": "<p>Опис книги</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pub_date",
            "description": "<p>Дата створення</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "_",
            "description": "<p>Оновлений об'єкт</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n \"tag\": \"stack1512399565452\",\n \"name\": \"Дон Кіхот\",\n \"author\": \"Мігель де dasdsa\",\n \"rating\": 4,\n \"descr\": \"Роман іспанського письменника Мігеля де Сервантеса Сааведра. Головний герой так любить читати лицарські романи, що вирішує податися на пошуки пригод як мандрівний лицар.\",\n \"likes_num\": 21,\n \"dislikes_num\": 2,\n \"pub_date\": \"1523-09-26\",\n \"_id\": \"5a26e56f9b23c319aa6cae69\",\n \"img\": \"localhost:3000/images/books/stack1512399565452.jpg\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>Неправильні дані користувача</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Не має відповідного ресурсу</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Виникла помилка на сервері</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NotAuthorized",
          "content": "HTTP/1.1 401 NotAuthorized\n{\n \"status\": \"Неправильні дані користувача\"*\n}",
          "type": "json"
        },
        {
          "title": "NotFound",
          "content": "HTTP/1.1 404 NotFound\n{\n \"status\": \"Не знайдено\"\n}",
          "type": "json"
        },
        {
          "title": "ServerError",
          "content": "HTTP/1.1 500 ServerError\n{\n \"status\": \"Помилка на сервері\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/api/v1/books.js",
    "groupTitle": "Books"
  },
  {
    "type": "delete",
    "url": "/users/:_id",
    "title": "Видалити користувача",
    "sampleRequest": [
      {
        "url": "/api/v1/users/5a257f7d25476c421e88635d"
      }
    ],
    "name": "DeleteUser",
    "group": "Users",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Access Authentication token</p>"
          },
          {
            "group": "Header",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>&quot;deleted&quot; - статус видалення</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "entity",
            "description": "<p>Видалений об'єкт</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"deleted\",\n  \"entity\": {\n    \"_id\": \"5a257f7d25476c421e88635d\",\n    \"username\": \"admin\",\n    \"type\": \"admin\",\n    \"pass\": \"$2a$08$siSH7ztyEhpCylhlmWJnhOVuune0QWTKjwFKkjGTQgCS4M0zKHsZO\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>Неправильні дані користувача або користувач не є адміном</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Не має відповідного ресурсу</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Виникла помилка на сервері</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NotAuthorized",
          "content": "HTTP/1.1 401 NotAuthorized\n{\n \"status\": \"Неправильні дані користувача або користувач не є адміном\"*\n}",
          "type": "json"
        },
        {
          "title": "NotFound",
          "content": "HTTP/1.1 404 NotFound\n{\n \"status\": \"Не знайдено\"\n}",
          "type": "json"
        },
        {
          "title": "ServerError",
          "content": "HTTP/1.1 500 ServerError\n{\n \"status\": \"Помилка на сервері\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/api/v1/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/users/:_id",
    "title": "Отримати користувача по id",
    "sampleRequest": [
      {
        "url": "/api/v1/users/5a257f7d25476c421e88635d"
      }
    ],
    "name": "GetUserById",
    "group": "Users",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Access Authentication token</p>"
          },
          {
            "group": "Header",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "_",
            "description": "<p>Отриманий користувач</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n \"_id\": \"5a257f7d25476c421e88635d\",\n \"username\": \"admin\",\n \"type\": \"admin\",\n \"pass\": \"$2a$08$siSH7ztyEhpCylhlmWJnhOVuune0QWTKjwFKkjGTQgCS4M0zKHsZO\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>Неправильні дані користувача або користувач не є адміном</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Не має відповідного ресурсу</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Виникла помилка на сервері</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NotAuthorized",
          "content": "HTTP/1.1 401 NotAuthorized\n{\n \"status\": \"Неправильні дані користувача або користувач не є адміном\"*\n}",
          "type": "json"
        },
        {
          "title": "NotFound",
          "content": "HTTP/1.1 404 NotFound\n{\n \"status\": \"Не знайдено\"\n}",
          "type": "json"
        },
        {
          "title": "ServerError",
          "content": "HTTP/1.1 500 ServerError\n{\n \"status\": \"Помилка на сервері\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/api/v1/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "Повернути користовачів",
    "sampleRequest": [
      {
        "url": "/api/v1/users"
      }
    ],
    "name": "GetUsers",
    "group": "Users",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Basic Access Authentication token</p>"
          },
          {
            "group": "Header",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "p",
            "description": "<p>Сторінка результату (дефолт: 0)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "entities",
            "description": "<p>Масив користувачів</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "total_entities_num",
            "description": "<p>Загальна кілкість сутностей</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "entities_per_page",
            "description": "<p>Сутностей на сторінці</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>Індекс сторінки</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 Success\n{\n \"entities\": [\n     {\n         \"_id\": \"5a257f7d25476c421e88635d\",\n         \"username\": \"admin\",\n         \"type\": \"admin\",\n         \"pass\": \"$2a$08$siSH7ztyEhpCylhlmWJnhOVuune0QWTKjwFKkjGTQgCS4M0zKHsZO\"\n     },\n     {\n         \"_id\": \"5a257fe73c4b19422aa994ff\",\n         \"username\": \"nikitos\",\n         \"type\": \"regular\",\n         \"pass\": \"$2a$08$O4fBy.0xE79C0zMfH0J/ouCnMYbWIVqL71bp0h4McoRjWxvL4vBKS\"\n     }\n ],\n \"total_entities_num\": 2,\n \"entities_per_page\": 5,\n \"page\": 0\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>Неправильні дані користувача або користувач не є адміном</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Виникла помилка на сервері</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NotAuthorized",
          "content": "HTTP/1.1 401 NotAuthorized\n{\n \"status\": \"Неправильні дані користувача або користувач не є адміном\"*\n}",
          "type": "json"
        },
        {
          "title": "ServerError",
          "content": "HTTP/1.1 500 ServerError\n{\n \"status\": \"Помилка на сервері\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/api/v1/users.js",
    "groupTitle": "Users"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./doc/main.js",
    "group": "_home_nikita_projects_WebstormProjects_web_labs_lab7_doc_main_js",
    "groupTitle": "_home_nikita_projects_WebstormProjects_web_labs_lab7_doc_main_js",
    "name": ""
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./public/doc/api/v1/main.js",
    "group": "_home_nikita_projects_WebstormProjects_web_labs_lab7_public_doc_api_v1_main_js",
    "groupTitle": "_home_nikita_projects_WebstormProjects_web_labs_lab7_public_doc_api_v1_main_js",
    "name": ""
  }
] });
