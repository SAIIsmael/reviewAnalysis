const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const treetagger = require('treetagger');
const cors = require('cors');
const http = require('http');
const request = require('request');
var qs = require('querystring');
const fs = require('fs');
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

  app.get("/testreq/:word", cors(corsOptions), (req, res) => {
    console.log("mot avant : " + unescape(req.params.word));
    let word = escape("crétin");
    console.log("mot : " + word);
    console.log(url);
    request("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" + word + "&rel=36?gotermsubmit=Chercher&gotermrel=" + word + "&rel=36", {
      json: true
    }, (err, res, body) => {
      if (err) {
        return console.log(err);
      }
      const regex = /((e;[0-9]+;.*)|(r;[0-9]+;.*))/gm;
      console.log(body.match(regex));
      let array = body.match(regex);

      let regexpolneutre = /.*POL-NEUTRE.*/gm;
      let regexpolpos = /.*POL-POS.*/gm;
      let regexpolneg = /.*POL-NEG.*/gm;

      for (var i = 0; i < array.length; i++) {
        array[i] = array[i].split(";");

        if (array[i][2].match(regexpolneutre)) {
          var polneutre = array[i][1];
          console.log("NEUTRE : " + polneutre);
        }

        if (array[i][2].match(regexpolpos)) {
          var polpos = array[i][1];
          console.log("POS : " + array[i][1]);
        }

        if (array[i][2].match(regexpolneg)) {
          var polneg = array[i][1];
          console.log("NEG : " + array[i][1]);
        }

        if (array[i][3].localeCompare(polneutre) == 0) {
          polneutre = array[i][5];
          console.log("polarité neutre : " + polneutre);
        }

        if (array[i][3].localeCompare(polpos) == 0) {
          polpos = array[i][5];
          console.log("polarité positive : " + polpos);
        }

        if (array[i][3].localeCompare(polneg) == 0) {
          polneg = array[i][5];
          console.log("polarité negative : " + polneg);
        }
      }
      console.log(array);
    });
  });

  app.get("/polarite/:name", cors(corsOptions), (req, res) => {
    let name = '"' + req.params.name + '"';
    let a = '';
    var data = fs.readFileSync('../Ressources/polaritejdm.txt')
      .toString()
      .split('\n')
      .map(e => e.trim())
      .map(e => e.split(';').map(e => e.trim()));
    let i = 0;
    while (i < data.length && data[i][0].localeCompare(name) != 0) {
      console.log(data[i]);
      i++;
    }
    console.log(data[i]);
    a = data[i][1];
    console.log(a);
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
        res.end(data.match("<CODE>(\r\n|\r|\n|.)*<\/CODE>"));
      });

    }).on("error", (err) => {
      console.log("Error:" + err.message);
    });
  });

});