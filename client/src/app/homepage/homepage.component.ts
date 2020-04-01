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

test(){
  this.tmp = [];
  this.review = this.sentence.split('.');
  this.review.pop();
  console.log(this.review);
  this.review.forEach(sentence =>{
    this.polarite.ttSentence(sentence).subscribe(data =>{
      this.tmp.push(data);
      console.log("Received : " + JSON.stringify(this.tmp));
      console.log('ATTENTION ICI PB CALLBACK VOIR AVEC MR.POMPIDOR');
    })
  })
}

testPolarite(){
  this.sentenceTags = [];
for (let i = 0; i < this.tmp.length; i++) {
  for(let j = 0; j < this.tmp[i][0].length; j++){
    this.tmp[i][0][j].sentence = i;
    this.sentenceTags.push(this.tmp[i][0][j]);
}
}
console.log(JSON.stringify(this.sentenceTags));
this.sentenceTags.forEach(word =>{
  console.log("WORD : " + JSON.stringify(word));
    if ( word.l.includes("unknown")){
  this.polarite.requeterezo(word.t).subscribe(data=>{
  console.log("T : "+word.t+" -> "+ JSON.stringify(data[0]));
  word.polarite =data[0];
  console.log('NEW WORD : '+ JSON.stringify(word));
})
}else{
  this.polarite.requeterezo(word.l).subscribe(data=>{
  console.log("L : "+word.l+" -> "+ JSON.stringify(data[0]));
  word.polarite = data[0];
  console.log('NEW WORD : '+ JSON.stringify(word));
})
}
});

}

printReviewTagged(){
  console.log(JSON.stringify(this.sentenceTags));
}

testColoration(){
  this.parsedWord = this.sentence.split(".");
  for ( let i = 0; i < this.parsedWord.length; i++){
  //  console.log("test color, parsedWord =  " + JSON.stringify(this.parsedWord[i]));
    if ( this.parsedWord[i].length > 1 ){
    this.parsedWord[i] = this.parsedWord[i].split(" ");
    let hasBeenSplice = false;
    for ( let j = 0; j < this.parsedWord[i].length; j++){
        if ( i > 0 && !hasBeenSplice){
      //    console.log("PARSED WORD FIRST LETTER : " + this.parsedWord[i][0]);
          this.parsedWord[i].splice(0,1);
          hasBeenSplice = true;
        }
    }
//    console.log("test color, new parsedWord =  " + JSON.stringify(this.parsedWord[i]));

    }
}
this.polarizedWords = [];
  for( let i = 0; i < this.sentenceTags.length; i++){

    let polarite = 0;
    let intens = 0;
    let neg = 1;
    let npp;
    if (this.sentenceTags[i].pos.localeCompare("ADJ") == 0 ){
       npp =  this.parsedWord[this.sentenceTags[i].sentence][this.sentenceTags[i].npp];

      console.log("[*"+(this.sentenceTags[i].polarite.positif - this.sentenceTags[i].polarite.negatif)+"] par adjectif plus proche : " + this.sentenceTags[i].t + " sur " + this.parsedWord[this.sentenceTags[i].sentence][this.sentenceTags[i].npp]);
        polarite += (this.sentenceTags[i].polarite.positif - this.sentenceTags[i].polarite.negatif);
      }
      if (this.sentenceTags[i].itens > 0 ){
       npp =  this.parsedWord[this.sentenceTags[i].sentence][this.sentenceTags[i].npp];
        console.log("[*" +this.sentenceTags[i].itens+"] par intens : " + this.sentenceTags[i].t + " sur " + this.parsedWord[this.sentenceTags[i].sentence][this.sentenceTags[i].npp]);
        intens+=this.sentenceTags[i].itens;
      }
      if (this.sentenceTags[i].neg == true){
         npp =  this.parsedWord[this.sentenceTags[i].sentence][this.sentenceTags[i].npp];
        console.log("[* -1]par negation : " + this.sentenceTags[i].t + " sur " + this.parsedWord[this.sentenceTags[i].sentence][this.sentenceTags[i].npp]);
        neg*=this.sentenceTags[i].neg;
      }
      this.polarizedWords.push({"word":npp, "polarité":polarite, "neg":neg, "intensifieur":intens});

    }

}


debugPolarize(){
  console.log(this.polarizedWords);
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
