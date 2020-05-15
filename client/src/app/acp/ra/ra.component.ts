import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../_services/auth.service';
import { ReviewsService } from '../../_services/reviews.service';
import { PolariteServiceService } from '../../_services/polarite-service.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ra',
  templateUrl: './ra.component.html',
  styleUrls: ['./ra.component.css']
})
export class RAComponent implements OnInit {
  authSubscription : Subscription;
  connected:  Boolean;
  idConnected : string;
  memberInfos = {
   email : '',
   hotel : [],
   size: 0
  }
  reviews = [];
  reviewDisplayed = 0;
  treeTagged = [];
  currentReview = [];
  hasBeenSelected = false;
  sentenceTags = [];
  polarite = [];
  parsedWord = [];
  polarizedWords= [];
  toPrint = [];
  parsedWordisOk = false;
  patternPolarite = [];


  constructor(private AuthService : AuthService, private ReviewsService : ReviewsService, private PolariteService : PolariteServiceService) { }

  ngOnInit() {

    this.authSubscription = this.AuthService.loginSubject.subscribe(
      (loginInfos: any[]) =>{
        this.connected = loginInfos[0];
        this.idConnected = loginInfos[1];
        this.memberInfos.email = loginInfos[1];
        this.memberInfos.hotel = loginInfos[2];
        this.memberInfos.size = loginInfos[3];

        this.ReviewsService.getAllReviews(this.memberInfos.hotel[0].name).subscribe(data =>{
          for( var i = 0; i < data.length; i ++ ){
            this.reviews.push(data[i]);
          }
        });
      });
  }

  previousReview(){
    this.hasBeenSelected = false;
    this.toPrint = [];
    this.patternPolarite =[];

    if(this.reviewDisplayed > 0){
      this.reviewDisplayed--;
    }
  }

  nextReview(){
    this.hasBeenSelected = false;
    this.toPrint = [];
    this.patternPolarite =[];

    if(this.reviewDisplayed < this.reviews.length -1){
      this.reviewDisplayed++;
    }
  }

  selectReview(){
    this.toPrint = [];
    this.patternPolarite =[];

    this.hasBeenSelected = true;
    this.treeTagged = [];
    this.currentReview = this.reviews[this.reviewDisplayed].review.split('.');
    this.currentReview.pop();
    console.log(this.currentReview);
    this.currentReview.forEach(sentence =>{
      this.PolariteService.ttSentence(sentence).subscribe(data =>{
        this.treeTagged.push(data);
        console.log("Received : " + JSON.stringify(this.treeTagged));
        console.log('ATTENTION ICI PB CALLBACK VOIR AVEC MR.POMPIDOR');
      })
    })
  }

  polariteCalcul(){

    this.sentenceTags = [];
  for (let i = 0; i < this.treeTagged.length; i++) {
    for(let j = 0; j < this.treeTagged[i][0].length; j++){
      this.treeTagged[i][0][j].sentence = i;
      this.sentenceTags.push(this.treeTagged[i][0][j]);
  }
  }
  console.log(JSON.stringify(this.sentenceTags));
  this.sentenceTags.forEach(word =>{
    console.log("WORD : " + JSON.stringify(word));
      if ( word.l.includes("unknown")){
    this.PolariteService.rezoDumpPolarite(word.t).subscribe(data=>{
    console.log("T : "+word.t+" -> "+ JSON.stringify(data[0]));
    word.polarite =data[0];
    word.polaritePropa = parseFloat(data[0].positif) - parseFloat(data[0].negatif);
    console.log('NEW WORD : '+ JSON.stringify(word));
  })
  }else{
    this.PolariteService.rezoDumpPolarite(word.l).subscribe(data=>{
    console.log("L : "+word.l+" -> "+ JSON.stringify(data[0]));
    word.polarite = data[0];
    word.polaritePropa = parseFloat(data[0].positif) - parseFloat(data[0].negatif);
    console.log('NEW WORD : '+ JSON.stringify(word));
  })
  }
  });
  }

  executePattern(){
      let sentenceToTest = this.reviews[this.reviewDisplayed].review.split(".");
      for (let i = 0; i < sentenceToTest.length-1; i++) {
          console.log("ici -> " + sentenceToTest[i]);
          this.PolariteService.requetePattern(sentenceToTest[i]).subscribe(data=>{
            let toPush = {}
            if(parseFloat(data.polarité) == 0){
            toPush = {
              "phrase" : sentenceToTest[i],
              "polarite" : "Aucun pattern n'a match cette phrase"
            }
          }else{
            toPush = {
              "phrase" : sentenceToTest[i],
              "polarite" : data.polarité
            }
          }
          console.log("pushed -> "+ JSON.stringify(toPush) );
            this.patternPolarite.push(toPush);
          })
      }

    }


  executePropagation(){

    this.parsedWord = this.reviews[this.reviewDisplayed].review.split(".");
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
  this.parsedWordisOk = true;
  this.polarizedWords = [];
    for( let i = 0; i < this.sentenceTags.length; i++){

      let polarite = 0;
      let intens = 0;
      let neg = 1;
      let npp;
      if (this.sentenceTags[i].pos.localeCompare("ADJ") == 0 ){

        console.log("[*"+(this.sentenceTags[i].polarite.positif - this.sentenceTags[i].polarite.negatif)+"] par adjectif plus proche : " + this.sentenceTags[i].t + " sur " + this.parsedWord[this.sentenceTags[i].sentence][this.sentenceTags[i].npp]);

        this.toPrint.push("[*"+(this.sentenceTags[i].polarite.positif - this.sentenceTags[i].polarite.negatif)+"] par adjectif plus proche : " + this.sentenceTags[i].t + " sur " + this.parsedWord[this.sentenceTags[i].sentence][this.sentenceTags[i].npp]);

          this.sentenceTags[this.sentenceTags[i].npp].polaritePropa += (this.sentenceTags[i].polarite.positif - this.sentenceTags[i].polarite.negatif);

           console.log("polarite de : "+this.sentenceTags[this.sentenceTags[i].npp].t+ "-> " + this.sentenceTags[this.sentenceTags[i].npp].polaritePropa );

        }
        if (this.sentenceTags[i].itens > 0 ){
         npp =  this.parsedWord[this.sentenceTags[i].sentence][this.sentenceTags[i].npp];
          console.log("[*" +this.sentenceTags[i].itens+"] par intens : " + this.sentenceTags[i].t + " sur " + this.parsedWord[this.sentenceTags[i].sentence][this.sentenceTags[i].npp]);
          this.toPrint.push("[*" +this.sentenceTags[i].itens+"] par intens : " + this.sentenceTags[i].t + " sur " + this.parsedWord[this.sentenceTags[i].sentence][this.sentenceTags[i].npp]);
         this.sentenceTags[this.sentenceTags[i].npp].polaritePropa *= this.sentenceTags[i].itens;

          console.log("polarite de : "+this.sentenceTags[this.sentenceTags[i].npp].t+ "-> " + this.sentenceTags[this.sentenceTags[i].npp].polaritePropa );

        }
        if (this.sentenceTags[i].neg == true){
           npp =  this.parsedWord[this.sentenceTags[i].sentence][this.sentenceTags[i].npp];
          console.log("[* -1]par negation : " + this.sentenceTags[i].t + " sur " + this.parsedWord[this.sentenceTags[i].sentence][this.sentenceTags[i].npp]);
          this.toPrint.push("[* -1]par negation : " + this.sentenceTags[i].t + " sur " + this.parsedWord[this.sentenceTags[i].sentence][this.sentenceTags[i].npp]);
          this.sentenceTags[this.sentenceTags[i].npp].polaritePropa *= -1;
          console.log("polarite de : "+this.sentenceTags[this.sentenceTags[i].npp].t+ "-> " + this.sentenceTags[this.sentenceTags[i].npp].polaritePropa );


        }

      }


  }



}
