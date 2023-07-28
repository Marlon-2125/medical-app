import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UsersService } from 'src/app/services/users.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  userRole:number = 0;

  constructor(private _router: Router,private _usersSvc: UsersService) { }

  ngOnInit(): void {
    const userId = sessionStorage.getItem('user_id') || '';
    this.getRoleById(userId);
  }

  onNavigate(link:string){
    this._router.navigate([link]);
    const elementHamburger = document.getElementById('check') || '';
    if(elementHamburger != ''){
      elementHamburger.click();
    }
  }  

  getRoleById(userId: string){
    this._usersSvc.getCurrentUser(userId).pipe(
      map(actions => {
        return actions.map(
          (data: any) => ({
            profile_ID: data.payload.doc.data().profile_ID
          }));
      }))
      .subscribe(res => {this.userRole = res[0].profile_ID});
  }
}
