import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  private url = 'http://localhost:8888/';

  constructor(private http:HttpClient) { }

  getAllReviews(hotelname){
    return this.http.get<any []>(this.url+"pro/reviews/"+hotelname);
  }
}
