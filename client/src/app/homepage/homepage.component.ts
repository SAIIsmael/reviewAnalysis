import { Component, OnInit, Input } from '@angular/core';
import { PolariteServiceService } from '../_services/polarite-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  @Input() private sentence : any;
  @Input() private word : any;
  private tab : any[] = new Array();
  private motapolarise : any[] =  new Array();
  private polariteNom : any[] = new Array();
  private polaritePhrase : any;
  private red = false;
  private cpt;
  private endPos = false;

  private review = [];
  private tmp = [];
  private sentenceTags = [];
  private parsedWord = [];
  private polarizedWords = [];

  constructor(private polarite : PolariteServiceService, private router : Router) { }

  ngOnInit() {
  }


  updateData(data, value){
      switch(data){
        case "word":
        this.word = value;
        break;
        case "sentence":
        this.sentence = value;
        //console.log(this.sentence);
      }
    }


requetePhrase(){


}

reqrev(){
  console.log("dans req rev");
  this.polarite.requeteReview(this.sentence).subscribe(data =>{
    console.log("recu : " + JSON.stringify(data));
    this.tab = data;
  });
}

nomplusproche(indice){
  let res = 10000000;
  this.endPos = false;
  for ( let i = 0; i < this.tab.length; i++ ){
    for(let j = 0; j < this.tab[i].length; j++){
      if ( this.tab[i][j].pos == "NOM"){
        console.log("ADJ"+ this.tab[i][indice].t+"POS : " + indice + ", NOM"+this.tab[i][j].t +"POS : " + j);
        if ( Math.abs(j-indice) < res){
            res = j;
            console.log("RES DE NPP" + res);
        }
  }
}
}
this.endPos = true;
return res;
}

coloration(){
    let som = 0;
    console.log("COLORATION POLARITE NOM : " + JSON.stringify(this.polariteNom));
    for (let k =0; k < this.polariteNom.length; k++){
      som+=this.polariteNom[k].polarité;
    }
    this.polaritePhrase = {"phrase":this.sentence,"polarité":som/this.cpt};
    console.log("POLARITE DE LA PHRASE : " + JSON.stringify(this.polaritePhrase));
    if(som/this.cpt < 0){
    this.red = true;
  }else{
    this.red = false;
  }

  }

matchPattern(){
  this.polarite.requetePattern(this.sentence).subscribe(data =>{
    console.log(data);
  })
}

analyse(){
  this.cpt = 0;
  this.polariteNom = [];
  for (let i = 0; i < this.tab.length; i++) {
    if ( this.tab[i].length > 1){
      for(let j = 0; j < this.tab[i].length; j++){

        if ( this.tab[i][j].pos == "ADJ"){
          this.cpt++;
          var indiceNom = this.nomplusproche(j);

          this.motapolarise.push(this.tab[i][j].t);
          if ( this.tab[i][j].l.includes("unknown")){
          this.polarite.requeterezo(this.tab[i][j].t).subscribe(data=>{

            this.polarite.requeterezo(this.tab[i][j].t).subscribe(data =>{

              this.polariteNom.push({"nom" : this.tab[i][indiceNom].t, "polarité" : (data[0].positif - data[0].negatif) });

            })
          })
        }else{
          this.polarite.requeterezo(this.tab[i][j].t).subscribe(data=>{

            this.polarite.requeterezo(this.tab[i][j].l).subscribe(data =>{

              this.polariteNom.push({"nom" : this.tab[i][indiceNom].t, "polarité" : (data[0].positif - data[0].negatif) , "pos" : i});

                  })
              })
          }
        }
      }
    }
  }
}

MatchNameByIndex(nom,indice){
  let res = 0 ;
  for(let i = 0 ; i<this.polariteNom.length;i++){

    if(this.polariteNom[i].nom.localeCompare(nom)==0 && this.polariteNom[i].pos==indice){
        res = i ;
    }
  }
return res ;
}

neg(){
  for (let i = 0; i < this.tab.length; i++) {
    for(let j = 0; j < this.tab[i].length; j++){
      if ( this.tab[i][j].pos == "ADV"){
        this.polarite.requeteNeg(this.tab[i][j].t).subscribe(data => {

          console.log(JSON.stringify("le serveur a rendu : "+data));

          if(data === "true"){
            let nomplusproche = this.nomplusproche(j);
            console.log("valeur de nomplusproche: " + nomplusproche);

            let indicepl = this.MatchNameByIndex(this.tab[i][nomplusproche],i);

            console.log("ici "+this.polariteNom[indicepl]);

            this.polariteNom[indicepl].polarité = this.polariteNom[indicepl].polarité * -1;

          }

        })
      }
    }
  }
}
  intense(){
    for (let i = 0; i < this.tab.length; i++) {
      for(let j = 0; j < this.tab[i].length; j++){
        if ( this.tab[i][j].pos == "ADV"){
          this.polarite.requeteInten(this.tab[i][j].t).subscribe(data => {

            console.log(JSON.stringify("le serveur a rendu : "+data));

            if(data.Intensifieur === "true"){
              let nomplusproche = this.nomplusproche(j);
              console.log("valeur de nomplusproche: " + nomplusproche);

              let indicepl = this.MatchNameByIndex(this.tab[i][nomplusproche],i);

              console.log("ici "+this.polariteNom[indicepl]);

              this.polariteNom[indicepl].polarité = this.polariteNom[indicepl].polarité * data.coef;

            }

          })
        }
      }
    }
  }

requete() {
  console.log("ici dans component");
  console.log(this.word);
  this.polarite.requeterezo(this.word).subscribe(data =>{
    this.tab = data;
    console.log(data);
  });
}
}
