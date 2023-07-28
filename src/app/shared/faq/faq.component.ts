import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  userRole: number = 0;

  constructor(private _fAuth: AuthenticationService, private _router: Router, private _usersSvc: UsersService) { }

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
      .subscribe(res => this.userRole = res[0].profile_ID);
  }

  openDialog(idVimeo: string){
    Swal.fire({
      html: `<div style="padding:221.75% 0 0 0;position:relative;">
                <iframe src="https://player.vimeo.com/video/${idVimeo}?badge=0&amp;autoplay=true&amp;controls=false&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
            </div>`,
      showConfirmButton: true,
      confirmButtonText: 'Volver',
      customClass: {
        container: 'custom-sweet-iframe'
      }
    });
  }

}
