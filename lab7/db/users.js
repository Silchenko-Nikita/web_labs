const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const configs = require('../configs');
const  utils = require('../utils');

mongoose.connect(configs.dbUrl, { useMongoClient: true });
mongoose.Promise = global.Promise;

const REGULAR_USER = 'regular';
const ADMIN_USER = 'admin';

let userSchema = new mongoose.Schema({
  username: String,
  pass: String,
  type: String
}, {versionKey: false });

userSchema.plugin(passportLocalMongoose);
let User = mongoose.model('User', userSchema);

function find(find={}, sort={}, skip=0, limit=null) {
  let books = User.find(find).sort(sort).skip(skip);
  if (limit !== null){
    books = books.limit(limit);
  }
  return books.exec().then(function(books){
    return books;
  })
}

function findAndCount(find_d={}, sort={}, skip=0, limit=null) {
  return find(find_d, sort, skip, limit).then(users => {
    return User.find(find_d).count().then(num => {
      return {
        entities: users,
        num: num
      }
    })
  })
}

function getById(_id) {
  return User.findOne({ _id: _id }).exec().then(function(user){
    return user;
  }).catch( e => {
    return null;
  })
}

module.exports.User = User;
module.exports.getById = getById;
module.exports.find = find;
module.exports.findAndCount = findAndCount;
module.exports.REGULAR_USER = REGULAR_USER;
module.exports.ADMIN_USER = ADMIN_USER;