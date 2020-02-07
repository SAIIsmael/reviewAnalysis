import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Subscription, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PolariteServiceService {

  private url = 'http://localhost:8888/testreq/';

  constructor(private http:HttpClient) { }


requeterezo(word : any) : Observable<any> {
  console.log("ici dans service ");
  return this.http.get(this.url+word);
}
}
