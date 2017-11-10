let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/booksland";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("books").findOne({}, function(err, result) {
    if (err) throw err;
    console.log(result.name);
    db.close();
  });
});