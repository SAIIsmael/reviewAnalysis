import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PolariteServiceService } from './_services/polarite-service.service'

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpHeaders,
    HttpClientModule
  ],
  providers: [PolariteServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
