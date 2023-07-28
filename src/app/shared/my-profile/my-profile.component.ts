import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { UsersService } from 'src/app/services/users.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  userId: string = '';

  user: any = {
    type_ID: "",
    identification: 0,
    name: "",
    surnames: "",
    phone: 0,
    email: "",
    location: "",
    profile_ID: ""
  };

  constructor(private _usersSvc: UsersService, private _authSvc: AuthenticationService) { }

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('user_id') || '';
    this.getUserinfo(this.userId);
  }

  getUserinfo(userId: string) {
    this._usersSvc.getCurrentUser(userId).pipe(
      map(actions => {
        return actions.map(
          (data: any) => ({
            userId: data.payload.doc.id,
            type_ID: data.payload.doc.data().type_ID,
            identification: data.payload.doc.data().identification,
            names: data.payload.doc.data().names,
            surnames: data.payload.doc.data().surnames,
            phone: data.payload.doc.data().phone,
            email: data.payload.doc.data().email,
            location: data.payload.doc.data().location,
            profile_ID: this._authSvc.toStringRoles(JSON.stringify(data.payload.doc.data().profile_ID))
          }));
      }))
      .subscribe( data => {
        this.user = data[0];
        console.log(data)
      });
  }

}
