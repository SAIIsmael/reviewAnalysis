import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PolariteServiceService } from './_services/polarite-service.service';
import { SentenceTagComponent } from './sentence-tag/sentence-tag.component';
import { jqxTreeGridComponent } from 'jqwidgets-ng/jqxtreegrid';
import { OntologyComponent } from './ontology/ontology.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    SentenceTagComponent,
    jqxTreeGridComponent,
    OntologyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [PolariteServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
