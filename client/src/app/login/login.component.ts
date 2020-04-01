import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  toLog = {
    "email" : "",
    "password" : ""
    };

  constructor(private AuthService : AuthService, private router : Router) { }

  ngOnInit() {
  }

  updateData(data, value){
      switch(data){
        case "email":
        this.toLog.email = value;
        console.log("edit email : " + this.toLog.email);
        break;
        case "password":
        this.toLog.password = value;
        console.log("edit pass : " + this.toLog.email);
        break;
      }
    }

    log(){
      console.log('data sent : ' + JSON.stringify(this.toLog));
      this.AuthService.logPro(this.toLog).subscribe(data =>{
        console.log(data);
         this.AuthService.setConnected(data.connected, data.email, data.hotel, data.hotel.length);
         this.AuthService.emitConnected();
   });
     setTimeout(() => {
       this.router.navigate(['acp']);
    }, 1000);

    }
}
