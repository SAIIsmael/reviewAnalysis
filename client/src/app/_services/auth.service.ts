import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Subscription, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
    loginSubject = new Subject<any[]>();
    private isConnected : boolean;
    private idConnected : boolean;
    private hotelList;
    private hotelListLength;

  private url = 'http://localhost:8888/';

  constructor(private http:HttpClient) { }

  emitConnected(){
     console.log("emit : id =>" + this.idConnected + " is => " + this.isConnected + " hotels => " + this.hotelList + " hotel size => " + this.hotelListLength);
     this.loginSubject.next([this.isConnected, this.idConnected, this.hotelList, this.hotelListLength]);
   }

   setConnected(isConnected, idConnected,hotelList, hotelListLength){
      this.idConnected = idConnected;
      this.isConnected = isConnected;
      this.hotelList = hotelList;
      this.hotelListLength = hotelListLength

    }

  public authPro(proUser : any) : Observable<any> {
    return this.http.post(this.url+"pro/auth", proUser);
    }

  public logPro(proUser : any ) : Observable<any> {
    return this.http.post(this.url+"pro/login", proUser);
  }

}
