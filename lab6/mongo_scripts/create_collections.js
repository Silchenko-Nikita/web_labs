let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/booksland";

MongoClient.connect(url, function(err, db) {
  if (err) {
    console.log(err);
    return;
  }

  db.createCollection("books", function(err, res) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Collection created!");
    db.close();
  });
});