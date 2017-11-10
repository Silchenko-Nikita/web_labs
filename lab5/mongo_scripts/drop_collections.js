let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/booksland";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("books").drop(function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Collection deleted");
    db.close();
  });
});