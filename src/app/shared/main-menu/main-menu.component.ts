import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  userRole: number = 0;

  constructor(private _usersSvc: UsersService) { }

  ngOnInit(): void {
    const userId = sessionStorage.getItem('user_id') || '';
    this.getRoleById(userId);
  }

  getRoleById(userId: string){
    this._usersSvc.getCurrentUser(userId).pipe(
      map(actions => {
        return actions.map(
          (data: any) => ({
            profile_ID: data.payload.doc.data().profile_ID
          }));
      }))
      .subscribe(res => {console.log(res[0].profile_ID);this.userRole = res[0].profile_ID});
  }

}
