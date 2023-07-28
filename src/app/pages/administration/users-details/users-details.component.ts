import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-users-details',
  templateUrl: './users-details.component.html',
  styleUrls: ['./users-details.component.css']
})
export class UsersDetailsComponent implements OnInit {

  userId: any;
  user: any = [];

  constructor(private _route: ActivatedRoute, private _userSvc: UsersService, private _authSvc: AuthenticationService) {
    this.userId = this._route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getUser(this.userId);
  }
  
  getUser(userId: string){
    this._userSvc.getUserById(userId).subscribe((data:any) => {
      this.user = data;
      this.user.profile_ID = this._authSvc.toStringRolesAndRoutes(JSON.stringify(this.user.profile_ID)); 
    });
  }

}
