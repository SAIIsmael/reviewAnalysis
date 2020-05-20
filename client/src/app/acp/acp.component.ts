import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { ReviewsService } from '../_services/reviews.service';
@Component({
  selector: 'app-acp',
  templateUrl: './acp.component.html',
  styleUrls: ['./acp.component.css']
})
export class ACPComponent implements OnInit {
  percentage;
  authSubscription : Subscription;
  connected:  Boolean;
  idConnected : string;
  memberInfos = {
   email : '',
   hotel : [],
   size: 0
  }
  reviews = [];

  constructor(private AuthService : AuthService, private ReviewsService : ReviewsService) { }

  ngOnInit() {

    this.authSubscription = this.AuthService.loginSubject.subscribe(
      (loginInfos: any[]) =>{
        this.connected = loginInfos[0];
        this.idConnected = loginInfos[1];
        this.memberInfos.email = loginInfos[1];
        this.memberInfos.hotel = loginInfos[2];
        this.memberInfos.size = loginInfos[3];
      });
      this.percentage = 0;
      this.AuthService.emitConnected();
      console.log(this.connected);
      console.log(this.idConnected);
      console.log(JSON.stringify(this.memberInfos.hotel));
      console.log("HOTEL NAME : " + this.memberInfos.hotel[0].name);
      this.ReviewsService.getAllReviews(this.memberInfos.hotel[0].name).subscribe(data =>{
        for( var i = 0; i < data.length; i ++ ){
          console.log("DATA : " + parseFloat(data[i].rating));
          if ( parseFloat(data[i].rating) > 2.5){
            this.percentage=parseFloat(this.percentage)+1;
          }
          this.reviews.push(data[i]);
        }
        this.percentage = (100*this.percentage)/this.reviews.length;
        console.log("new percentage = " + this.percentage);


      })
  }

  getReviewCounter(){
    let res = 0;
    for ( var i = 0; i < this.memberInfos.size; i ++){
      res+= this.memberInfos.hotel[i].reviewCounter;
    }
    return res;
  }

  getLastReview(){
    console.log(this.reviews[this.reviews.length-1]);
    return this.reviews[this.reviews.length-1];
  }




}
