let express = require('express');
let router = express.Router();
let bodyParser = require("body-parser");
// let app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
