import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PolariteServiceService {

  private url = 'http://localhost:8888/testreq/'; 

  constructor(private http:HttpClient) { }


requeterezo(word : any){
  return this.http.get(this.url+word);
}
}
