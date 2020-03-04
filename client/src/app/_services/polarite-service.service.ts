import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Subscription, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PolariteServiceService {

  private url = 'http://localhost:8888/';

  constructor(private http:HttpClient) { }


requeterezo(word : any) : Observable<any> {
  return this.http.get(this.url+"testreq/"+word);
  }

requetetreetagger() : Observable<any> {
  return this.http.get(this.url+"reviewtype");
  }

requeteReview(review : any) : Observable<any> {
  return this.http.get(this.url+"review/" + review);
  }
requeteNeg(word : any) : Observable<any> {
  return this.http.get(this.url+"neg/"+word);
  }
}
