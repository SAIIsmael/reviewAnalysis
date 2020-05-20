import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../_services/auth.service';
import { ReviewsService } from '../../_services/reviews.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PolariteServiceService } from '../../_services/polarite-service.service';
import { jqxTreeGridComponent } from 'jqwidgets-ng/jqxtreegrid';
import { Edge, Node } from '@swimlane/ngx-graph';
import * as d3 from 'd3';
import * as shape from 'd3-shape';

@Component({
  selector: 'app-ra',
  templateUrl: './ra.component.html',
  styleUrls: ['./ra.component.css']
})
export class RAComponent implements OnInit {

  @ViewChild('treeGridReference', {static: false}) treeGrid: jqxTreeGridComponent;


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
  displayAnSyn = false;



	private ontologyMemory: any = new Object();

	private idreview: number = null;
	private reviewpol: number = null;
	private part: string = "";


  public words : any[] = new Array();
  public edges : any[] = new Array();
  private print : boolean = false;
  public nodes: Node[] = [];
  public links: Edge[] = [];
  curve = shape.curveLinear;

  constructor(private AuthService : AuthService, private ReviewsService : ReviewsService, private PolariteService : PolariteServiceService) { }

  ngOnInit() {
    this.print = false;
    this.load();

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
    this.displayAnSyn = false;

    if(this.reviewDisplayed > 0){
      this.reviewDisplayed--;
    }
  }

  nextReview(){
    this.hasBeenSelected = false;
    this.toPrint = [];
    this.patternPolarite =[];
    this.displayAnSyn = false;

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
            for( let i = 0; i < this.sentenceTags.length; i++){
                  if (this.sentenceTags[i].pos.localeCompare("NOM") == 0 ){
                    console.log(JSON.stringify(this.sentenceTags[i]));
                    this.sentenceTags[i].polaritePattern = data.polarité;
                    let toPush2 = {
                      "idreview" : this.reviews[this.reviewDisplayed].idreview,
                      "name" : this.sentenceTags[i].t,
                      "polarite" : this.sentenceTags[i].polaritePattern
                    };
                    console.log("pushed ->" + toPush2)
                    this.polarizedWords.push(toPush2);
                  }
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
    for( let i = 0; i < this.sentenceTags.length; i++){

      let polarite = 0;
      let intens = 0;
      let neg = 1;
      let npp;
      if (this.sentenceTags[i].pos.localeCompare("ADJ") == 0 ){

        console.log("[*"+(this.sentenceTags[i].polarite.positif - this.sentenceTags[i].polarite.negatif)+"] par adjectif plus proche : " + this.sentenceTags[i].t + " sur " + this.parsedWord[this.sentenceTags[i].sentence][this.sentenceTags[i].npp]);

        this.toPrint.push("[*"+(this.sentenceTags[i].polarite.positif - this.sentenceTags[i].polarite.negatif)+"] par adjectif plus proche : " + this.sentenceTags[i].t + " sur " + this.sentenceTags[this.sentenceTags[i].npp].t);

          this.sentenceTags[this.sentenceTags[i].npp].polaritePropa += (this.sentenceTags[i].polarite.positif - this.sentenceTags[i].polarite.negatif);

           console.log("polarite de : "+this.sentenceTags[this.sentenceTags[i].npp].t+ "-> " + this.sentenceTags[this.sentenceTags[i].npp].polaritePropa );

        }
        if (this.sentenceTags[i].itens > 0 ){
         npp =  this.parsedWord[this.sentenceTags[i].sentence][this.sentenceTags[i].npp];
          console.log("[*" +this.sentenceTags[i].itens+"] par intens : " + this.sentenceTags[i].t + " sur " + this.parsedWord[this.sentenceTags[i].sentence][this.sentenceTags[i].npp]);
          this.toPrint.push("[*" +this.sentenceTags[i].itens+"] par intens : " + this.sentenceTags[i].t + " sur " + this.sentenceTags[this.sentenceTags[i].npp].t);
         this.sentenceTags[this.sentenceTags[i].npp].polaritePropa *= this.sentenceTags[i].itens;

          console.log("polarite de : "+this.sentenceTags[this.sentenceTags[i].npp].t+ "-> " + this.sentenceTags[this.sentenceTags[i].npp].polaritePropa );

        }
        if (this.sentenceTags[i].neg == true){
           npp =  this.parsedWord[this.sentenceTags[i].sentence][this.sentenceTags[i].npp];
          console.log("[* -1]par negation : " + this.sentenceTags[i].t + " sur " + this.parsedWord[this.sentenceTags[i].sentence][this.sentenceTags[i].npp]);
          this.toPrint.push("[* -1]par negation : " + this.sentenceTags[i].t + " sur " + this.sentenceTags[this.sentenceTags[i].npp].t);
          this.sentenceTags[this.sentenceTags[i].npp].polaritePropa *= -1;
          console.log("polarite de : "+this.sentenceTags[this.sentenceTags[i].npp].t+ "-> " + this.sentenceTags[this.sentenceTags[i].npp].polaritePropa );


        }

      }

      for (let i = 0; i < this.sentenceTags.length; i++) {
          if(this.sentenceTags[i].pos.localeCompare("NOM") == 0){
            let toPush = {};
            console.log(JSON.stringify(this.reviews[this.reviewDisplayed]));
            if( this.sentenceTags[i].l.includes("unknown") ){
             toPush = {
              "idreview" : this.reviews[this.reviewDisplayed].idreview,
              "name" : this.sentenceTags[i].t,
              "polarite" : this.sentenceTags[i].polaritePropa
            }
}else{
  toPush = {
    "idreview" : this.reviews[this.reviewDisplayed].idreview,
    "name" : this.sentenceTags[i].l,
    "polarite" : this.sentenceTags[i].polaritePropa
  }
}
            console.log("pushed ->" + JSON.stringify(toPush));
        this.polarizedWords.push(toPush);
        }
      }
  }

  setPolarity(id, pol, word) {
console.log("IN SET POLARITY WITH " + id + pol + word);
		this.PolariteService.setOntology(id,pol,word).subscribe(data =>{
			Object.assign(this.ontologyMemory, data);
			this.treeGrid.updateBoundData();
			this.treeGrid.expandAll();
//			this.treeGrid.collapseAll();
		});

	}

	load() {
		this.PolariteService.loadOntology().subscribe(data =>{
			Object.assign(this.ontologyMemory, data);
			this.treeGrid.updateBoundData();
			this.treeGrid.expandAll();
//			this.treeGrid.collapseAll();
		});
	}

	reset() {
		this.PolariteService.resetOntology().subscribe(data =>{
			Object.assign(this.ontologyMemory, data);
			this.treeGrid.updateBoundData();
			this.treeGrid.expandAll();
//			this.treeGrid.collapseAll();
		});
	}

	dump() {
		this.PolariteService.dumpOntology().subscribe(data =>{
		});
	}

	private source: any =
	{
		dataType: "json",
		localData: this.ontologyMemory,
		dataFields: [
			{ name: "idpart", type: "number" },
			{ name: "part", type: "string" },
			{ name: "synonyms", type: "string" },
			{ name: "reviews", type: "array" },
			{ name: "idreview", type: "number" },
			{ name: "reviewpol", type: "number" },
			{ name: "reviewmean", type: "number" },
			{ name: "subparts", type: "array" },
			{ name: "subpartmean", type: "number" },
			{ name: "polarity", type: "number" }
		],
		root: "root",
		id: "idpart",
		hierarchy:
		{
			root: "subparts"
		}
	}

	public dataAdapter: any = new jqx.dataAdapter(this.source);

	public columns: any[] =
	[
		{ text: "Parts", dataField: "part", width: 200 },
		{ text: "Synonyms", dataField: "synonyms", width: 250 },
		{ text: "Reviews", dataField: "reviews", width: 125,
			cellsRenderer: function (row, column, value, rowData) {
				var result="";
				if(value!=null) {
					for (var r=0; r<value.length; r++) {
						var obj = value[r];
						for (var k in obj) {
							var v = obj[k];
							if(k=="reviewpol") {
								result += v+" ";
							}
						}
					}
				}
				return result;
			}
		},
		{ text: "Review mean", dataField: "reviewmean", width: 100,
			cellsRenderer: function (row, column, value, rowData) {
				if (value <0) { return '<span style="color: #D00000; font-weight: bold;">' + value + '</span>'; }
				if (value >0) { return '<span style="color: #00D000; font-weight: bold;">' + value + '</span>'; }
				return value;
			}
		},
		{ text: "Subpart mean", dataField: "subpartmean", width: 125,
			cellsRenderer: function (row, column, value, rowData) {
				if (value <0) { return '<span style="color: #D00000; font-weight: bold;">' + value + '</span>'; }
				if (value >0) { return '<span style="color: #00D000; font-weight: bold;">' + value + '</span>'; }
				return value;
			}
		},
		{ text: "Polarity", dataField: "polarity", width: 100,
			cellsRenderer: function (row, column, value, rowData) {
				if (value <0) { return '<span style="color: #D00000; font-weight: bold;">' + value + '</span>'; }
				if (value >0) { return '<span style="color: #00D000; font-weight: bold;">' + value + '</span>'; }
				return value;
			}
		}
];

	public ready: any = () => {
		this.treeGrid.expandAll();
//		this.treeGrid.collapseAll();
	};

  printgraph(){

    for(let i = 0 ; i<this.nodes.length;i++){
      console.log("node number "+i+" "+JSON.stringify(this.nodes[i]));
    }
    for(let i = 0 ; i<this.edges.length;i++){
      console.log("edge number "+i+" "+JSON.stringify(this.links[i]));
    }
    this.print=true;
    this.displayAnSyn = false;
  }

  getgraph(){
    console.log("HERE HERE HERE " + this.currentReview);
    this.PolariteService.requeteGraphe(this.currentReview).subscribe(data =>{
      console.log("recu : " + JSON.stringify(data));

      this.words = data.graph.words;
      this.edges = data.graph.links;
      this.nodes = new Array(this.words.length);
      this.links = new Array(this.edges.length);
      console.log("words : "+this.words+" taille : "+this.words.length);
      console.log("edges : "+this.edges+" taille : "+this.edges.length);


      for(let i=0;i<this.words.length;i++){
          let label: string = this.words[i].label;
          let idword: string = this.words[i].id;
          this.nodes[i] = {
            id: idword,
            label: label
          }

       /*
          console.log("traitement du mot "+label+" d'id "+idword)
          for(let j = 0; j< this.edges.length;j++){


            console.log("l arete courante est : "+JSON.stringify(this.edges[j]));
            if(idword==this.edges[j].target){
              console.log("correspondance trouvee entre  "+this.edges[j].target+" et "+idword)
              this.edges[j].target = label;
            }
            else if(idword==this.edges[j].source){
              console.log("correspondance trouvee entre  "+this.edges[j].source+" et "+idword)
              this.edges[j].source = label;
            }
          }*/
      }

      for(let i=0;i<this.edges.length;i++){

        let idl : string = this.edges[i].id;
        let sl : string = this.edges[i].source;
        let tl : string = this.edges[i].target;
        let ll : string = this.edges[i].label;

        this.links[i] = {
          id: idl,
          source: sl,
          target: tl,
          label: ll
        }
      }
    });
  }


}
