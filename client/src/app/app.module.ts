import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'auth', component: AuthComponent},
  { path: 'acp', component: ACPComponent},
  {path: 'acp/reviewanalyzer', component: RAComponent},
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
    SidebarComponent,
    TopbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
    ],
  providers: [PolariteServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
