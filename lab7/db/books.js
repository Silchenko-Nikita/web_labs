const mongoose = require('mongoose');

const configs = require('../configs');
const fs = require('fs');

const books_images_dir = 'public/images/books';
const dbUrl = configs.dbUrl;

mongoose.connect(dbUrl, { useMongoClient: true });
mongoose.Promise = global.Promise;

let db = mongoose.connection;

let bookSchema = new mongoose.Schema({
  tag: String,
  name: String,
  author: String,
  rating: Number,
  likes_num: Number,
  dislikes_num: Number,
  pub_date: String,
  descr: String
}, {versionKey: false });

let Book = mongoose.model('Book', bookSchema);

const data_file = 'public/data/books.json';
const id = 'id';
// const metadata_file = '.books_meta.json';

const INVALID_DATA_ERR_CODE = 1;

const params = {
  'tag': "string",
  'name': "string",
  'author': "string",
  'rating': "number",
  'likes_num': "number",
  'dislikes_num': "number",
  'pub_date': "string",
  'descr': "string"
};

const validators = {
  'tag': [imgSaved],
  'name': [containsData],
  'author': [containsData],
  'rating': [gethen(1), lethen(5), isInteger],
  'likes_num': [gethen(0), isInteger],
  'dislikes_num': [gethen(0, isInteger)],
  'pub_date': [containsData, isDate],
  'descr': [containsData]
};

let print = console.log;

function imgSaved(key, val) {
  try {
    fs.readFileSync(configs.booksImagesDir + '/' + val + configs.filesFormat)
  } catch (e) {
    throw Error(key + " має відповідати назві збереженого файлу зображення (ім'я файлу без розширення)");
  }
}

function containsData(key, val) {
  if (val.length === 0){
    throw Error(key + " має містити дані");
  }
}

function isInteger(key, val) {
  if ((val ^ 0) !== val){
    throw Error(key + " має бути цілим числом");
  }
}

function gethen(getval){
  return function (key, val) {
    if (getval > val){
      throw Error("Значення " + key + " має бути не меньшим за " + getval);
    }
  }
}

function lethen(letval){
  return function (key, val) {
    if (letval < val){
      throw Error("Значення " + key + " має бути не більшим за " + letval);
    }
  }
}

function isDate(key, val) {
  if (isNaN(Date.parse(val))){
    throw Error(key + " має описувати дату");
  }
}

function validate_el_for_update(_id, el) {
  return new Promise(function (resolve, reject) {
    if (typeof el !== 'object') {
      return reject(new Error("Елемент має бути об'єктом"));
    }

    for (let key in el) {
      if (el.hasOwnProperty(key)) {
        if (params[key]) {
          if (typeof el[key] !== params[key]) {
            return reject(new Error(key + " має бути " + params[key]));
          }
          if (validators[key]) {
            for (val of validators[key]) {
              try {
                val(key, el[key])
              } catch (e){
                return reject(e);
              }
            }
          }
        } else {
          delete el[key];
        }
      }
    }
    return getById(_id).then(book => {
      if (book) {
        return Book.find({ _id: {'$ne': _id }, tag: el['tag'] }).then(e => {
          if (e.length > 0) {
            return reject(new Error("Об'єкт має містити унікальний tag"));
          }
          return resolve(el);
        })
      } else {
        return resolve(null);
      }
    })
  })
}

function validate_el_for_create(el) {
  return new Promise(function (resolve, reject) {
    if (typeof el !== 'object') {
      return reject(new Error("Елемент має бути об'єктом"));
    }

    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        if (el[key] === undefined){
          return reject(new Error("Об'єкт має містити " + key));
        }
        if (typeof el[key] !== params[key]) {
          return reject(new Error(key + " має бути " + params[key]));
        }
        if (validators[key]) {
          for (val of validators[key]) {
            try {
              val(key, el[key])
            } catch (e){
              return reject(e);
            }
          }
        }
      }
    }

    return Book.find({ tag: el['tag'] }).then(e => {
      if (e.length) {
        return reject(new Error("Об'єкт має містити унікальний tag"));
      }
      return resolve(el);
    })
  });
}

function getAll() {
  return Book.find({}).exec().then(function(books){
    return books;
  })
}

function find(find={}, sort={}, skip=0, limit=null) {
  let books = Book.find(find).sort(sort).skip(skip);
    if (limit !== null){
      books = books.limit(limit);
    }
    return books.exec().then(function(books){
    return books;
  })
}

function getById(_id) {
  return Book.findOne({ _id: _id }).exec().then(function(book){
    return book;
  }).catch( e => {
    return null;
  })
}

function create(x) {
  return validate_el_for_create(x).then(function (el) {
    let book = new Book(x);
    return book.save();
  });
}

function update(_id, x) {
  return validate_el_for_update(_id, x).then(function (el) {

    if (!el){
      return null;
    }

    return Book.update({ _id: _id }, el).exec().then( r => {
        return getById(_id);
      }
    );
  });
}


function remove(_id) {
  return Book.remove({ _id: _id });
}


function count(data) {
  return Book.count(data);
}


function findAndCount(find_d={}, sort={}, skip=0, limit=null) {
  return find(find_d, sort, skip, limit).then(books => {
    return Book.find(find_d).count().then(num => {
      return {
        entities: books,
        num: num
      }
    })
  })
}

function load_from_file(path='public/data/books.json') {
  let books = JSON.parse(fs.readFileSync(path, 'utf8'));

  // print(Array.isArray(books));

  for (book of books){
    // print(book);
    create(book).then(x => print(x));
  }
}

// Book.remove({}).then(x => print(x));
// load_from_file();

module.exports.getAll = getAll;
module.exports.find = find;
module.exports.count = count;
module.exports.findAndCount = findAndCount;
module.exports.getById = getById;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;