import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../_services/auth.service';
import { ReviewsService } from '../../_services/reviews.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  authSubscription : Subscription;
  connected:  Boolean;
  idConnected : string;
  memberInfos = {
   email : '',
   hotel : [],
   size: 0
  }

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
      this.AuthService.emitConnected();
      console.log(this.connected);
      console.log(this.idConnected);
      console.log(JSON.stringify(this.memberInfos.hotel));
      console.log("HOTEL NAME : " + this.memberInfos.hotel[0].name);

}

}
