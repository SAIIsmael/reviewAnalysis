import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
    selected;
    hovered = 0;
    readonly = false;


  constructor() { }

  ngOnInit(): void {
  }

}
