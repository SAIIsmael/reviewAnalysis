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

  app.get("/review/:review", cors(corsOptions), (req, res) => {
    let review = req.params.review;
    var s = [];
    var tagger = new treetagger();
    var tt = [];
    console.log("in review with sentence :" + review);
    s = review.split(".");
    console.log("split : " + s);
    s.forEach(element => {
      tagger.tag(element, function(err, results) {
        tt.push(results);
        console.log(results);
        if (s.length === tt.length) {
          res.end(JSON.stringify(tt));
          console.log(JSON.stringify(tt));
        }
      });
    });

  })

  app.get("/reviewType", cors(corsOptions), (req, res) => {
    console.log("In /reviewType");
    var tagger = new treetagger();
    var tabtag = [];

    try {
      db.collection("reviews").find().toArray((err, documents) => {
        let review = documents[0].review;
        console.log("Document trouvé : " + JSON.stringify(documents[0]));
        console.log(" ");
        console.log("Review de ce document : " + review);
        console.log(" ");
        var sentences = [];
        sentences = review.split(".");
        console.log("Découpage en phrases :" + sentences);
        console.log(" ");
        var i = 0;


        sentences.forEach(element => {
          tagger.tag(element, function(err, results) {
            tabtag.push(results);
            console.log(results);
            if (sentences.length === tabtag.length) {
              res.end(JSON.stringify(tabtag));
              console.log(JSON.stringify(tabtag));
            }
          });
        });
      });
    } catch (e) {
      console.log("Error on getting reviews");
      res.end(JSON.stringify([]));
    }
  });

  app.get("/testreq/:word", cors(corsOptions), (req, res) => {
    let word = req.params.word;

    console.log(word);
    console.log(url);
    request("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
      word + "&rel=36?gotermsubmit=Chercher&gotermrel=" + word +
      "&rel=36", {
        json: true
      }, (err, res2, body) => {
        if (err) {
          return console.log(err);
        }
        const regex = /((e;[0-9]+;.*)|(r;[0-9]+;.*))/gm;
        console.log(body.match(regex));
        let senay = body.match(regex);
        var polsenay = [];
        let regexpolneutre = /.*POL-NEUTRE_PC.*/gm;
        let regexpolpos = /.*POL-POS_PC.*/gm;
        let regexpolneg = /.*POL-NEG_PC.*/gm;

        var polneutre = "0";
        var polpos = "0";
        var polneg = "0";
        if (senay) {
          for (var i = 0; i < senay.length; i++) {
            senay[i] = senay[i].split(";");
            if (senay[i][2].match(regexpolneutre)) {
              console.log("REGEX = " + senay[i][2]);
              polneutre = senay[i][1];
              console.log("NEUTRE : " + polneutre);
            }

            if (senay[i][2].match(regexpolpos)) {
              polpos = senay[i][1];
              console.log("POS : " + senay[i][1]);
            }

            if (senay[i][2].match(regexpolneg)) {
              polneg = senay[i][1];
              console.log("NEG : " + senay[i][1]);
            }

            if (senay[i][3].localeCompare(polneutre) == 0) {
              polneutre = senay[i][5];

              console.log("polarité neutre : " + polneutre);
            }

            if (senay[i][3].localeCompare(polpos) == 0) {
              polpos = senay[i][5];
              console.log("polarité positive : " + polpos);
            }

            if (senay[i][3].localeCompare(polneg) == 0) {
              polneg = senay[i][5];
              console.log("polarité negative : " + polneg);
            }
          }
        }
        polsenay.push({
          "neutre": polneutre,
          "positif": polpos,
          "negatif": polneg
        });

        console.log(senay);
        console.log("renvoi" + polsenay);
        res.end(JSON.stringify(polsenay));


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