import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  ns = false;
  toRegister = {
    "email" : "",
    "password" : "",
    "hotel" : []
  };

  hotelToRegister = {
    "name" : "",
    "address" : "",
    "city" : "",
    "reviewCounter":0
  };

  updateData(data, value){
      switch(data){
        case "email":
        this.toRegister.email = value;
        console.log("edit email : " + this.toRegister.email);
        break;
        case "password":
        this.toRegister.password = value;
        console.log("edit pass : " + this.toRegister.email);
        break;
        case "hname":
        this.hotelToRegister.name = value;
        console.log("hotel name : " + this.hotelToRegister.name)
        break;
        case "haddress":
        this.hotelToRegister.address = value;
        console.log("hotel address : " + this.hotelToRegister.address)
        break;
        case "hcity":
        this.hotelToRegister.city = value;
        console.log("hotel city : " + this.hotelToRegister.city)
        break;

      }
    }

  constructor(private AuthService : AuthService, private router : Router) { }

  ngOnInit() {
  }

  nextStep(){
    this.ns = true;

  }

  previousStep(){
    this.ns = false;

  }

  submit(){
    this.toRegister.hotel = [];
    this.toRegister.hotel.push(this.hotelToRegister);
    console.log("data to send : " + JSON.stringify(this.toRegister));
    this.AuthService.authPro(this.toRegister).subscribe(data =>{
        console.log(data);
    })

  }

}
