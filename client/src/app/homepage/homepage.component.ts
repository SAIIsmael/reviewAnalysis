import { Component, OnInit, Input } from '@angular/core';
import { PolariteServiceService } from '../_services/polarite-service.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  @Input() private word : any;

  constructor(private polarite : PolariteServiceService) { }

  ngOnInit() {
  }


requete (){
  this.polarite.requeterezo(this.word);
}
}
