import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { MainMenuComponent } from './shared/main-menu/main-menu.component';
import { MainComponent } from './pages/main.component';
import { MaterialModule } from './utils/material/material.module';
import { LoadingBarModule } from '@ngx-loading-bar/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { environment } from '../environments/environment';

import { AuthenticationService } from './services/authentication.service';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { FaqComponent } from './shared/faq/faq.component';
import { MyProfileComponent } from './shared/my-profile/my-profile.component';
import { SideMenuComponent } from './shared/side-menu/side-menu.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SplashScreenComponent } from './shared/splash-screen/splash-screen.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainMenuComponent,
    MainComponent,
    ForbiddenComponent,
    FaqComponent,
    MyProfileComponent,
    SideMenuComponent,
    SplashScreenComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule, 
    LoadingBarModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFirestoreModule,
    MaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
