import { Component, OnInit, Input } from '@angular/core';
import { PolariteServiceService } from '../_services/polarite-service.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  @Input() private word : any;
  private tab : any[] = new Array();
  constructor(private polarite : PolariteServiceService) { }

  ngOnInit() {
  }


  updateData(data, value){
      switch(data){
        case "word":
        this.word = value;
      }
    }



requete() {
  console.log("ici dans component");
  console.log(this.word);
  this.polarite.requeterezo(this.word).subscribe(data =>{
    this.tab = data;
    console.log(this.tab);
  });
}
}
