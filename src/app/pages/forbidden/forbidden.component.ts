import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.css']
})
export class ForbiddenComponent implements OnInit {

  constructor(private _router: Router, private _authSvc: AuthenticationService) { }

  ngOnInit(): void {
  }

  onBack(){
    this._authSvc.logout();
    this._router.navigate(['/login']);
  }
}
