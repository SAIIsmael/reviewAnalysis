import { Component, OnInit } from '@angular/core';
import { PolariteServiceService } from '../_services/polarite-service.service';

@Component({
  selector: 'app-sentence-tag',
  templateUrl: './sentence-tag.component.html',
  styleUrls: ['./sentence-tag.component.css']
})
export class SentenceTagComponent implements OnInit {

  private sentence : any;
  private tab : any[] = new Array();
  private motapolarise = [];

  constructor(private polarite : PolariteServiceService) { }

  ngOnInit() {
  }

  /*
  updateData(data, value){
    switch(data){
      case "sentence":
      this.sentence = value;
    }
  }*/

  requete() {
    this.polarite.requetetreetagger().subscribe(data =>{
      this.tab = data;
      
      for (let i = 0; i < this.tab.length; i++) {
          this.tab[i].forEach(element => {
            if (element.pos == "ADJ" ){
              this.motapolarise.push(element.t);
              if ( element.l.includes("unknown")){
              this.polarite.requeterezo(element.t).subscribe(data=>{
                console.log(element.l + ": "+ element.l.includes("unknown") );
                console.log("Terme: " + element.t +":" + data);
                this.polarite.requeterezo(element.t).subscribe(data =>{
                  console.log("mot :" + element.t + "->" + "n:" + data[0] + "p:" + data[1] + "neg:" + data[2]);
                })
              })
            }else{
              this.polarite.requeterezo(element.t).subscribe(data=>{
                console.log(element.l + ": "+ element.l.includes("unknown") );
                console.log("Lemme: " + element.l +":" + data);
                this.polarite.requeterezo(element.l).subscribe(data =>{
                  console.log("mot :" + element.l + "->" + "n:" + data[0] + "p:" + data[1] + "neg:" + data[2]);
                })
              })
            }
            }
          });
      }
    });
  }

  nettoyage(){


  }
}
