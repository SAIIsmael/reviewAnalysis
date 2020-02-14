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
    console.log("ici dans component sentence");
    this.polarite.requetetreetagger().subscribe(data =>{
      this.tab = data;
      console.log(this.tab[0]);
      this.tab[0].split("");
      console.log(this.tab);
    });
  }

  nettoyage(){


  }
}
