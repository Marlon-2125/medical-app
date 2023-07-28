import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import { UserInterface } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  urlGlobalEndpoints: string = 'https://medicalapp.com.co/api/';
  
  public userId: any;
  public userEmail: any;
  public userRole: any;
  public userLoginName: any;

  constructor(public _afAuth: AngularFireAuth, public _fStore: AngularFirestore) { }

  login(username: string, password: string) {

    return new Promise((resolve, reject) => {
      this._afAuth.setPersistence('session').then(() => {
        this._afAuth.signInWithEmailAndPassword(username, password).
          then(userData => {
            this.userEmail = userData.user?.email;
            sessionStorage.setItem('user_email', this.userEmail);
            resolve(userData);
          },
            err => reject(err))
      });
    });
       
  }

  logout() {
    sessionStorage.clear();    
    return this._afAuth.signOut();
  }

  sendVerificationEmail(email: string): Promise<void> {
    return this._afAuth.sendPasswordResetEmail(email);
  }

  sendAccessRequest(data: any) {
    return fetch(this.urlGlobalEndpoints + 'access-request/create/',{
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(data),
      headers: {"Content-type": "application/json;charset=UTF-8"}
    });
  }

  verifyAccessRequest(userIdentification: any) {
    return fetch(this.urlGlobalEndpoints + 'access-request/verify/' + userIdentification,{
      method: 'GET',
      mode: 'cors',
      headers: {"Content-type": "application/json;charset=UTF-8"}
    });
  }

  getRole(userId: string) {
    return this._fStore.collection<UserInterface>('users', ref => ref.where('auth_ID', '==', userId)).valueChanges();
  }

  toStringRolesAndRoutes(profileId: string): string {

    switch (profileId) {
      case '1':
        profileId = "administrator";
        break;
      case '2':
        profileId = "repairman";
        break;
      case '3':
        profileId = "support";
        break;
    }
    return profileId;
  }

  toStringRoles(profileId: string): string {

    switch (profileId) {
      case '1':
        profileId = "Administrador";
        break;
      case '2':
        profileId = "Instalador y Reparador";
        break;
      case '3':
        profileId = "Técnico de Mantenimiento";
        break;
    }
    return profileId;
  }

}
