import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PolariteServiceService } from './_services/polarite-service.service';
import { SentenceTagComponent } from './sentence-tag/sentence-tag.component';

import { GrapheComponent } from './graphe/graphe.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    SentenceTagComponent,
    GrapheComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxGraphModule, NgxChartsModule,BrowserAnimationsModule,
    CommonModule
  ],
  providers: [PolariteServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
