let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/booksland";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  let myobj = { name: "Company Inc", address: "Highway 37" };
  db.collection("books").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});