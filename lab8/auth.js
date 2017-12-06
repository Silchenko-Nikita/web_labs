const basicAuth = require('express-basic-auth');
const utils = require('./utils');
const users_db = require('./db/users');


function genericUserAuthorizer(username, password, cb) {
  users_db.User.findOne({ username: username }).then(user => {

    if (!user || (!utils.validPassword(password, user) && password !== user.pass)) {
      return cb(null, false);
    }

    return cb(null, user);
  }).catch( e => cb(e));
}

function adminUserAuthorizer(username, password, cb) {
  users_db.User.findOne({ username: username, type: users_db.ADMIN_USER }).then(user => {

    if (!user || (!utils.validPassword(password, user) && password !== user.pass)) {
      return cb(null, false);
    }

    return cb(null, user);
  }).catch( e => cb(e));
}

let genericBasicAuth = basicAuth({
  authorizer: genericUserAuthorizer,
  authorizeAsync: true,
  unauthorizedResponse: function (req) {
    return {'status': 'Неправильні дані користувача'}
  }
});

let adminBasicAuth = basicAuth({
  authorizer: adminUserAuthorizer,
  authorizeAsync: true,
  unauthorizedResponse: function (req) {
    return {'status': 'Неправильні дані користувача або користувач не є адміном'}
  }
});

module.exports.genericBasicAuth = genericBasicAuth;
module.exports.adminBasicAuth = adminBasicAuth;