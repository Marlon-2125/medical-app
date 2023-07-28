import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from '../services/authentication.service'; 
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { take, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  profileRole: any = [];

  constructor(private _fAuth:AngularFireAuth, private _router:Router, private _fStore:AngularFirestore, private _authSvc: AuthenticationService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
    
    return this._fAuth.authState.pipe(
      take(1),
      switchMap(
        async (authState) => {
          if(authState){
            if(route.data.role != null){
              this.checkUserLogged(route, authState.uid);
            }
            return true;
          }
          else{
            this._router.navigate(['login']);
            return false;
          }
        }
      )
    );
  }

  checkUserLogged(route: ActivatedRouteSnapshot,
    userId: string){  
      
    this._authSvc.getRole(userId).pipe(
      take(1),
    )
    .subscribe(val => {

      this.profileRole = val;

      this.profileRole.forEach(((element: any) => {
        var dataQuery = element;
        this.profileRole = dataQuery['profile_ID'];        
      }));
      this.profileRole = JSON.stringify(this.profileRole);
      this.profileRole = this._authSvc.toStringRolesAndRoutes(this.profileRole);
      
      if(this.profileRole == route.data.role || this.profileRole == "administrator") {
        return true;
      }
      else{
        return true;
        this._router.navigate(['/forbidden']);
        return false;
      }  
      
    });
    
  }

  
}
