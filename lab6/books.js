let mongoose = require('mongoose');
const books_images_dir = 'public/images/books';
mongoose.connect('mongodb://nikitos:funnycats@ds149855.mlab.com:49855/heroku_s1fzsv21', { useMongoClient: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

let Book = mongoose.model('Book',
{
    id: Number,
    tag: String,
    name: String,
    author: String,
    rating: Number,
    likes_num: Number,
    dislikes_num: Number,
    descr: String
});

const data_file = 'public/data/books.json';
const id = 'id';
// const metadata_file = '.books_meta.json';

const INVALID_DATA_ERR_CODE = 1;

const params = {
     id: "number",
    'name': "string",
    'author': "string",
    'rating': "number",
    'likes_num': "number",
    'dislikes_num': "number",
    'pub_date': "string",
    'descr': "string"
};

const validators = {
    'pub_date': [isDate]
};

let print = console.log;

function isDate(val) {
    return !isNaN(Date.parse(val))
}

function validate_el_for_update(el) {
    if (typeof el !== 'object') return new Promise(function (resolve, reject) { return resolve(null);});
    if (!el[id]) return new Promise(function (resolve, reject) { return resolve(null);});

    for (let key in el){
        if (el.hasOwnProperty(key)){
            if (params[key]){
                if (typeof el[key] !== params[key] && !el[key] instanceof params[key]){
                  return new Promise(function (resolve, reject) { return resolve(null);});
                }
                if (validators[key]){
                    for (val of validators[key]){
                        if (!val(el[key])) return new Promise(function (resolve, reject) { return resolve(null);});
                    }
                }
            } else{
                delete el[key];
            }
        }
    }

    return getById(el['id']);
}

function validate_el_for_create(el) {
    if (typeof el !== 'object') return new Promise(function (resolve, reject) { return resolve(null);});

    for (let key in params){
        if (params.hasOwnProperty(key)){
            if (!el[key] || !(typeof el[key] === params[key] || el[key] instanceof params[key])){
              return new Promise(function (resolve, reject) { return resolve(null);});
            }
            if (validators[key]){
                for (val of validators[key]){
                    if (!val(el[key])) return new Promise(function (resolve, reject) { return resolve(null);});
                }
            }
        }
    }
    print(el);

    return new Promise(function (resolve, reject) {
        return resolve(el);
    })
}


function getAll() {
    return Book.find({}).exec().then(function(books){
        return books;
    })
}

function getById(x_id) {
      return Book.findOne({ id: x_id }).exec().then(function(book){
            return book;
      })
}

function create(x) {
    return validate_el_for_create(x).then(function (el) {
        if (el){
            let book = new Book(x);
            return book.save();
        } else {
            return INVALID_DATA_ERR_CODE
        }
    });
}


function update(x) {
    return validate_el_for_update(x).then(function (el) {
        if (el){
            for (let key in el){
              if (el.hasOwnProperty(key) && x[key]){
                el[key] = x[key];
              }
            }

            return Book.update({ id: x['id'] }, el).exec();
        } else {
            return INVALID_DATA_ERR_CODE
        }
    });
}


function remove(x_id) {
    return Book.remove({ id: x_id })
}


function load_from_file(path='public/data/books.json') {
    let fs = require('fs');
    let books = JSON.parse(fs.readFileSync(path, 'utf8'));

    print(Array.isArray(books));

    for (book of books){
        print(book);
        create(book).then(x => print(x));
    }
}

// Book.remove({}).then(x => print(x));
// load_from_file();

module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;