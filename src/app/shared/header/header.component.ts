import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen: boolean = false;
  userRole: any;


  constructor(private _fAuth: AuthenticationService, private _router: Router, private _usersSvc: UsersService) { }

  
  ngOnInit(): void {
    const userId = sessionStorage.getItem('user_id') || '';
    this.getCurrentUserById(userId);
  }

  onLogout(){
    this._fAuth.logout();
    this._router.navigate(['/login']);
  }

  getCurrentUserById(userId: string){
    this._usersSvc.getCurrentUser(userId).pipe(
      map(actions => {
        return actions.map(
          (data: any) => ({
            names: data.payload.doc.data().names,
            surnames: data.payload.doc.data().surnames,
            identification: data.payload.doc.data().identification,
            profile_ID: data.payload.doc.data().profile_ID
          }));
      }))
      .subscribe(res => {
        this.userRole = res[0].profile_ID;
        sessionStorage.setItem('user_names', res[0].names);
        sessionStorage.setItem('user_surnames', res[0].surnames);
        sessionStorage.setItem('user_identification', res[0].identification);
        sessionStorage.setItem('user_role', res[0].profile_ID);
      });
  }

  onOpenMenu(event:any){
    const elementSideNav = document.getElementById('side-nav') || '';
    if(elementSideNav != ''){
      if(this.isMenuOpen){
        elementSideNav.classList.remove("open");
        this.isMenuOpen = false;
      }
      else{
        elementSideNav.classList.add("open");
        this.isMenuOpen = true;
      }
    }
  }
}
