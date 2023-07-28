import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoPreloading, RouterModule, Routes } from '@angular/router';

import { MainComponent } from './pages/main.component';
import { FaqComponent } from './shared/faq/faq.component';
import { MyProfileComponent } from './shared/my-profile/my-profile.component';
import { MainMenuComponent } from './shared/main-menu/main-menu.component';

import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { AuthenticationGuard } from './guard/authentication.guard';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';

const routes: Routes = [
  { path:  '', redirectTo: '/contingencies/dashboard', pathMatch: 'full'},
  { path:  'main-menu', component: MainMenuComponent, canActivate: [AuthenticationGuard] },
  { path:  'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path:  'faq', component: FaqComponent},
  { path:  '', component: MainComponent, children: [
    { path:  'administration', loadChildren: () => import('./pages/administration/administration.module').then(m => m.AdministrationModule) },
    { path:  'contingencies', loadChildren: () => import('./pages/contingencies/contingencies.module').then(m => m.ContingenciesModule) },
    { path:  'bb8', loadChildren: () => import('./pages/bb8/bb8.module').then(m => m.Bb8Module) },
    { path:  'incomplete', loadChildren: () => import('./pages/incomplete/incomplete.module').then(m => m.IncompleteModule) },
    { path:  'scale-infraestructure', loadChildren: () => import('./pages/scale-infraestructure/scale-infraestructure.module').then(m => m.ScaleInfrastructureModule) },
    { path: 'forbidden', component: ForbiddenComponent},
    { path: 'my-profile', component: MyProfileComponent}
  ]},
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full'}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading }),
    LoadingBarRouterModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
