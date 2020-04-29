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
const shell = require('shelljs');
//const auxFun = require('./auxiliary_functions');
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
const db = 'hoterelview';

// Use connect method to connect to the server
MongoClient.connect(url, {
  useNewUrlParser: true
}, (err, client) => {
  let db = client.db("hotelreview");
  console.log("Server listening on port 8888");

  app.get("/review/matchPattern/:phrase", cors(corsOptions), (req, res) => {
    let sentence = req.params.phrase;

    fs.readFile("../patternAnalysis/output/patternClean.txt",
      function read(err, data) {
        const regex = /%%%(.|\n)*/gm;
        let value = "0";
        let expArray = [];
        let exps = data.toString("utf8").match(regex).toString().replace('%%%', '').toString();
        expArray = exps.trim().split("&");
        for (var i = 0; i < expArray.length; i++) {
          expArray[i] = expArray[i].trim().split(":");
        }
        for (var i = 0; i < expArray.length; i++) {
          var re = new RegExp(expArray[i][0]);
          if (sentence.match(re)) {
            console.log("IL Y A EU MATCH : " + expArray[i][1]);
            value = expArray[i][1];
          }
        }
        res.end(JSON.stringify({
          "polarité": value
        }))
      });
  });

  app.get("/review/:review", cors(corsOptions), (req, res) => {
    let review = req.params.review;
    let tt = "";
    fs.writeFile("tt.sh", 'echo "' + review + '" | tree-tagger-french', "utf8", function(err, file) {
      if (err) throw err;
      console.log('Saved!');
      fs.writeFile("tt.res", shell.exec("./tt.sh"), function(err, file) {
        if (err) throw err;
        console.log('Saved!');
        fs.readFile("tt.res", function read(err, data) {
          tt = data.toString("utf8");
          var results = [];
          var lines = tt.trim().split('\n');
          for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var items = line.split('\t');
            var item = {};
            item.t = items[0];
            item.pos = items[1];
            item.l = items[2];
            results.push(item);
          }
          var r = [];
          r.push(results);
          res.end(JSON.stringify(r));
        })
      })
    });

  });


  app.get("/isIntensifieur/:word", cors(corsOptions), (req, res) => {
    let word = req.params.word;
    fs.readFile("../Ressources/lexique_intensifieurs.txt", function read(err, data) {
      tt = data.toString("utf8");
      let ArrayI = tt.split("\n");
      for (var i = 0; i < ArrayI.length; i++) {
        ArrayI[i] = ArrayI[i].split(":");
      }
      let isInten = "false";
      let mul = "0";
      for (var i = 0; i < ArrayI.length; i++) {
        if (ArrayI[i][0].localeCompare(word) == 0) {
          isInten = "true";
          mul = ArrayI[i][1];
        }
      }
      res.end(JSON.stringify({
        "Intensifieur": isInten,
        "coef": mul
      }));
    });
  });

  app.get("/neg/:word", cors(corsOptions), (req, res) => {
    console.log("In /reviewType");

    var word = req.params.word;
    console.log("le word vaut " + word);

    try {
      fs.readFile("../Ressources/lexique_negation.txt", function read(err, data) {
        tt = data.toString("utf8");
        var lines = tt.trim().split('\n');
        console.log(lines);
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i];
          if (line.localeCompare(word) == 0)
            res.end(JSON.stringify("true"));
        }
        res.end(JSON.stringify("false"));
      })
    } catch (e) {
      console.log("Error neg service");
      res.end(JSON.stringify([]));
    }

  });

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

	// retourne le contenu de l ontologie depuis la base
	app.get("/ontology/load", cors(corsOptions), (req,res) => {
		console.log("/ontology/load");
		try {
			//get collection
			db.collection("ontology").find().toArray((err, ontology) => {
				delete ontology[0]['_id'];
				res.end(JSON.stringify(ontology[0]));
			});
		} catch(e) {
			console.log("Erreur sur /ontology/load: "+e);
			res.end(JSON.stringify([]));
		}
	});

	// affecte la valeur de polarité a la partie de l ontologie correspondande
	app.get("/ontology/set/:idreview/:reviewpol/:part", cors(corsOptions), (req,res) => {
	let idreview=req.params.idreview;
	let reviewpol=req.params.reviewpol;
		let part=req.params.part;
		console.log("/ontology/set/"+idreview+"/"+reviewpol+"/"+part);
		try {
			//get collection
			db.collection("ontology").find().toArray((err, ontology) => {
				delete ontology[0]['_id'];
				// add polarity
				setPolarity(ontology[0].root[0],idreview,reviewpol,part);
				try{
					// drop collection
					db.collection("ontology").drop({}, () => {
						// put collection
						db.collection("ontology").insertOne(ontology[0], () => {
							delete ontology[0]['_id'];
							res.end(JSON.stringify(ontology[0]));
						});
					});
				}catch(e) {
					console.log("Erreur sur /ontology/set/"+idreview+"/"+reviewpol+"/"+part+": "+e);
					res.end(JSON.stringify([]));
				}
			});
		} catch(e) {
			console.log("Erreur sur /ontology/set/"+idreview+"/"+reviewpol+"/"+part+": "+e);
			res.end(JSON.stringify([]));
		}
	});

	// recherche recursivement la partie de l ontologie a polariser
	function setPolarity(node,idreview,reviewpol,part) {
		var trace=true;
	var find=false;
	var idpart=0;
	var reviewmean=null;
	var subparts=[];
	var subpartmean=null;
	var result=null;
		for (var key in node) {
			if (node.hasOwnProperty(key)) {
				var value = node[key];
				if(key=="idpart") {
					idpart=value;
					// if(trace) console.log("id part: "+value);
				}
				if(key=="part") {
					if(value.toLowerCase()==part.toLowerCase()) {
						if(trace) console.log("find part: "+part);
						find=true;
					}
				}
				if(key=="synonyms") {
					if(!find) {
						for (var s=0; s<value.length; s++) {
							if(value[s].toLowerCase()==part.toLowerCase()) {
								if(trace) console.log("find synonym: "+part);
								find=true;
							}
						}
					}
				}
				if(key=="reviews") {
					if(find) {
						if(trace) console.log("add to reviews: "+reviewpol);
						var newReview = { "idreview": idreview, "reviewpol": reviewpol };
						value.push(newReview);
						reviewmean=0;
						for (var r=0; r<value.length; r++) {
							var obj = value[r];
							for (var k in obj) {
								var v = obj[k];
								if(k=="idreview") {
									//
								}
								if(k=="reviewpol") {
									reviewmean += parseInt(v);
								}
							}
						}
						reviewmean = Math.round(reviewmean/value.length);
					}
				}
				if(key=="reviewmean") {
					if(find) {
						if(trace) console.log("new review mean: "+reviewmean);
						node[key]=reviewmean;
					}
					else
						reviewmean=node[key];
				}
				if(key=="subparts") {
					for (var p=0; p<value.length; p++) {
						subresult = setPolarity(value[p],idreview,reviewpol,part);
						if(subresult!=null) {
							subparts.push(subresult);
						}
					}
					if(subparts!=null) {
						if(subparts.length>0) {
							subpartmean=0;
							for (var p=0; p<subparts.length; p++) {
								subpartmean += parseInt(subparts[p]);
							}
							subpartmean = Math.round(subpartmean/subparts.length);
						}
					}
				}
				if(key=="subpartmean") {
					if(subpartmean!=null)
						node[key]=subpartmean;
				}
				if(key=="polarity") {
					var polarity=null;
					var nbmean=0;
					if(reviewmean!=null) {
						polarity += reviewmean;
						nbmean++;
					}
					if(subpartmean!=null) {
						polarity += subpartmean;
						nbmean++;
					}
					if(nbmean>1) {
						polarity = Math.round(polarity/nbmean);
					}
					if(polarity!=null) {
						node[key]=polarity;
						result = polarity;
					}
				}
			}
		}
		return result;
	}

	// monte le contenu de l ontologie depuis le fichier vierge vers la base et retourne ce nouveau contenu
	app.get("/ontology/reset", cors(corsOptions), (req,res) => {
		console.log("/ontology/reset");
		try{
				// drop collection
				db.collection("ontology").drop({}, () => {
				const fs = require('fs');
				try{
					// read file
					fs.readFile('ontologieHotellerie.json', (err, fromfile) => {
						let ontology = JSON.parse(fromfile);
						try{
							// put collection
							db.collection("ontology").insertOne(ontology, () => {
								delete ontology['_id'];
								res.end(JSON.stringify(ontology));
							});
						}catch(e) {
							console.log("Erreur sur /ontology/reset: "+e);
							res.end(JSON.stringify([]));
						}
					});
				}catch(e) {
					console.log("Erreur sur /ontology/reset: "+e);
					res.end(JSON.stringify([]));
				}
			});
		}catch(e) {
			console.log("Erreur sur /ontology/reset: "+e);
			res.end(JSON.stringify([]));
		}
	});

	// descend le contenu de l ontologie depuis la base vers le fichier dump
	app.get("/ontology/dump", cors(corsOptions), (req,res) => {
		console.log("/ontology/dump");
		const fs = require('fs');
		try {
			// get collection
			db.collection("ontology").find().toArray((err, ontology) => {
				delete ontology[0]['_id'];
				let tofile = JSON.stringify(ontology[0]);
				try{
					// write file
					fs.writeFile('./dump.json', tofile, (err) => {
						res.end(JSON.stringify([]));
					});
				}catch(e) {
					console.log("Erreur sur /ontology/dump: "+e);
					res.end(JSON.stringify([]));
				}
			});
		} catch(e) {
			console.log("Erreur sur /ontology/dump: "+e);
			res.end(JSON.stringify([]));
		}
	});

});
