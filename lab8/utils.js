const multer = require('multer');
const bcrypt = require('bcrypt-nodejs');

const configs = require('./configs');
const users_db = require('./db/users');


let booksImgsStorage = multer.diskStorage({
  destination: configs.booksImagesDir,
  filename: function (req, file, callback) {
    callback(null,  file.originalname.split(".")[0].replace(/\W+/g, '-') + Date.now() +configs.filesFormat);
  }
});


function imgsFilter(req, file, callback) {
  let original_format = file.originalname.split(".").slice(-1)[0].toLowerCase();
  console.log(original_format);
  if (original_format === 'jpg' || original_format  === 'png' || original_format === 'jpeg') return callback(null, true);
  return callback(null, false);
}

let booksImgUpload = multer({storage: booksImgsStorage, fileFilter: imgsFilter}).single('img');


// hash the password
function generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// checking if password is valid
function validPassword(password, user) {
  return user ? bcrypt.compareSync(password, user.pass): false;
}

function render(req, res, viewname, extra) {
  users_db.User.findOne({ _id: req.user }, function(err, user) {
    extra = extra || {};
    if (user) {
      extra.username = user.username;
      extra.auth_token = "Basic " + new Buffer(user.username + ":" + user.pass).toString("base64")
    }
    res.render(viewname, extra);
    return res;
  });
}

function checkAuth(req, res, next) {
  if (!req.user) return res.sendStatus(401); // 'Not authorized'
  next();  // пропускати далі тільки аутентифікованих
}


function checkAdmin(req, res, next) {
  users_db.User.findOne({ _id: req.user }, function(err, user) {
    if (!user) res.sendStatus(401); // 'Not authorized'
    else if (user.type !== users_db.ADMIN_USER) res.sendStatus(403); // 'Forbidden'
    next();  // пропускати далі тільки аутентифікованих із роллю 'admin'
  });
}

function getBookImg(req, tag) {
  return req.headers.host  + '/' + configs.booksImagesPath + '/' + tag + configs.filesFormat;
}

function getBookWithImgField(req, book) {
  let book_new = JSON.parse(JSON.stringify(book));
  book_new.img = getBookImg(req, book['tag']);
  return book_new
}

exports.booksImgUpload = booksImgUpload;
exports.getBookWithImgField = getBookWithImgField;
exports.generateHash = generateHash;
exports.validPassword = validPassword;
exports.checkAuth = checkAuth;
exports.checkAdmin = checkAdmin;
exports.render = render;