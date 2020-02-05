const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const treetagger = require('treetagger');
const cors = require('cors');
const http = require('http');
const app = express();
app.use(express.json());

var corsOptions = {
  origin: 'http://localhost:4200',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(express.urlencoded({
  extended: true
}));
app.options('*', cors());
app.listen(8888);

// Database Name
const db = 'hotereview';

// Use connect method to connect to the server
MongoClient.connect(url, {
  useNewUrlParser: true
}, (err, client) => {
  let db = client.db("hotereview");
  console.log("Server listening on port 8888");

  app.get("/reviewType", cors(corsOptions), (req, res) => {
    console.log("In /reviewType");
    var tagger = new treetagger();

    try {
      db.collection("reviews").find().toArray((err, documents) => {
        let review = documents[0].review;
        console.log("Document trouvé : " + JSON.stringify(documents[0]));
        console.log(" ");
        console.log("Review de ce document : " + review);
        console.log(" ");
        let sentences = review.split(".");
        console.log("Découpage en phrases :" + sentences);
        console.log(" ");
        tagger.tag(sentences[0], function(err, results) {
          console.log("Etiquettage de la phrase 1 " + results);
          res.end(JSON.stringify(sentences));
        });
      })
    } catch (e) {
      console.log("Error on getting reviews");
      res.end(JSON.stringify([]));
    }
  });

  app.get("/rezoChar", cors(corsOptions), (req, res) => {
    http.get("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=char&rel=36?gotermsubmit=Chercher&gotermrel=char&rel=36", (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        console.log("new chunk : ");
        data += chunk;
      });

      resp.on('end', () => {
        console.log("end : ");
        console.log(data);
        res.end(data);
      });
    }).on("error", (err) => {
      console.log("Error:" + err.message);
    });
  });

});