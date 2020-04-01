const fs = require('fs');
const shell = require('shelljs');

let listIntensifier = [];
fs.readFile("../Ressources/lexique_intensifieurs.txt", function read(err, data) {
  tt = data.toString("utf8");
  listIntensifier = tt.split("\n");
  for (var i = 0; i < listIntensifier.length; i++) {
    listIntensifier[i] = listIntensifier[i].split(":");
  }
  //  console.log("intensifer set");
});

let listNegation = [];
fs.readFile("../Ressources/lexique_negation.txt", function read(err, data) {
  tt = data.toString("utf8");
  listNegation = tt.trim().split('\n');
});

function isNeg(word) {
  let res = false;
  for (var i = 0; i < listNegation.length; i++) {
    console.log("DANS IS NEG : " + listNegation[i] + '-> ' + word);
    if (listNegation[i].localeCompare(word) == 0) {
      res = true;
      console.log(word + "is a negation");
    }
  }
  return res;
}

function getIntensifier(word) {
  let res = 0;
  for (var i = 0; i < listIntensifier.length; i++) {
    if (listIntensifier[i][0].localeCompare(word) == 0) {
      console.log("word:  " + word + " - inten : " + listIntensifier[i][1]);
      res = parseFloat(listIntensifier[i][1]);
    }
  }
  console.log("isInten res=  " + res);
  return res;
}


function getNPP(ttArray, index) {
  let res = 10000000;
  for (let j = 0; j < ttArray.length; j++) {
    //  console.log("NPP : " + JSON.stringify(ttArray[j]));
    //  console.log()
    if (ttArray[j].pos == "NOM") {
      console.log("ADJ:" + ttArray[index].t + " POS : " + index + ", NOM" + ttArray[j].t + "POS : " + j);
      if (Math.abs(j - index) < res) {
        res = j;
      }
    }
  }
  console.log("RES DE NPP" + res);
  return res;
}

module.exports = {
  treeTagger: function(review, res) {
    //  console.log("echo '" + review + '" | tree-tagger-french');
    fs.writeFile("tt.sh", 'echo "' + review + '" | tree-tagger-french', "utf8", function(err, file) {
      if (err) throw err;
      console.log('script tt.sh saved with success!');
      fs.writeFile("tt.res", shell.exec("./tt.sh"), function(err, file) {
        if (err) throw err;
        console.log('tt.res saved with success!');
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
            item.at = i;
            results.push(item);
          }
          r = [];
          r.push(results);
          for (var i = 0; i < r.length; i++) {
            for (var j = 0; j < r[i].length; j++) {
              var intensifier = getIntensifier(r[i][j].t);
              r[i][j].itens = intensifier;
              r[i][j].neg = isNeg(r[i][j].t);
              if (r[i][j].pos == "ADJ" || r[i][j].pos == "ADV") {
                r[i][j].npp = getNPP(r[i], j);
              }
            }
          }
          console.log(r);
          res.end(JSON.stringify(r));
        })
      })
    })
  }
};