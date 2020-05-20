import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PolariteServiceService } from './_services/polarite-service.service';
import { SentenceTagComponent } from './sentence-tag/sentence-tag.component';
import { LoginComponent } from './login/login.component'
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ACPComponent } from './acp/acp.component';
import { RAComponent } from './acp/ra/ra.component';
import { SidebarComponent } from './acp/sidebar/sidebar.component';
import { TopbarComponent } from './acp/topbar/topbar.component';
import { RatingComponent } from './acp/ra/rating/rating.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OntologyComponent } from './ontology/ontology.component';
import { jqxTreeGridComponent } from 'jqwidgets-ng/jqxtreegrid';
import { OntoComponent } from './acp/onto/onto.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const appRoutes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'auth', component: AuthComponent},
  { path: 'acp', component: ACPComponent},
  {path: 'acp/reviewanalyzer', component: RAComponent},
  {path: 'acp/onto', component: OntoComponent},
  { path: '', component: HomepageComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    SentenceTagComponent,
    LoginComponent,
    AuthComponent,
    ACPComponent,
    RAComponent,
    jqxTreeGridComponent,
    SidebarComponent,
    TopbarComponent,
    RatingComponent,
    OntologyComponent,
    OntoComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    NgxGraphModule, NgxChartsModule,BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
    ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [PolariteServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
