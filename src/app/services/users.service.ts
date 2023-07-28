import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  urlEndpoints: string = 'https://autogestionterreno.com.co/api/users/';
  urlServerEndpoints: string = 'http://10.100.66.254:7771/api/';
  urlGlobalEndpoints: string = 'https://autogestionterreno.com.co/api/';

  constructor(public _afStore: AngularFirestore) { }

  getUsers() {
    return this._afStore.collection("alerts", ref => ref.where('state', '==', 1)).snapshotChanges();
  }

  getUserById(userId: string) {
    return this._afStore.collection("users").doc(userId).valueChanges();
  }

  getCurrentUser(userId: string) {
    return this._afStore.collection("users", ref => ref.where('auth_ID', '==', userId)).snapshotChanges();
  }

  createUser(data: any) {
    return fetch(this.urlEndpoints,{
      method: 'POST',
      body: JSON.stringify(data),
      headers: {"Content-type": "application/json;charset=UTF-8"}
    });    
  }

  updateUser(data: any) {
    return fetch(this.urlEndpoints,{
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(data),
      headers: {"Content-type": "application/json;charset=UTF-8"}
    });
  }

  deleteUser(data: any) {
    data.state = 0;

    return new Promise((resolve, reject) => {
      this._afStore.collection("users").doc(data.userId).update({state: data.state})
        .then(
          (res) => resolve(res),
          (err) => reject(err)
        );
        
    });
  }

  getAccessRequests() {
    return this._afStore.collection("access_request", ref => ref.orderBy("status", "asc").orderBy("dateCreated", "asc")).snapshotChanges();
  }

  checkUserExist(engineerIdentification: any) {
    return fetch(this.urlEndpoints + 'checkuser/' + engineerIdentification,{
      method: 'GET',
      mode: 'cors',
      headers: {"Content-type": "application/json;charset=UTF-8"}
    });
  }

  resetCredentials(engineerClickData: any, requestId: any) {
    let dataToSend = engineerClickData[0];
    dataToSend.requestId = requestId;
    return fetch(this.urlEndpoints + 'reset/' + dataToSend.ID,{
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(dataToSend),
      headers: {"Content-type": "application/json;charset=UTF-8"}
    });
  }

  createUserByRequest(engineerClickData: any, requestId: any) {
    let dataToSend = engineerClickData[0];
    dataToSend.requestId = requestId;
    return fetch(this.urlEndpoints + 'createbyrequest/',{
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(dataToSend),
      headers: {"Content-type": "application/json;charset=UTF-8"}
    });
  }


  getClickEngineerById(engineerIdentification: any) {
    return fetch(this.urlServerEndpoints + 'engineer/identification/' + engineerIdentification,{
      method: 'GET',
      mode: 'cors',
      headers: {"Content-type": "application/json;charset=UTF-8"}
    });
  }

  getClickEngineerByIds() {
    return fetch(this.urlServerEndpoints + 'engineer/identification/',{
      method: 'GET',
      mode: 'cors',
      headers: {"Content-type": "application/json;charset=UTF-8"}
    });
  }

  approveRequest(requestId: any) {    
    return fetch(this.urlGlobalEndpoints + 'access-request/approve/',{
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({requestId: requestId, status: 1}),
      headers: {"Content-type": "application/json;charset=UTF-8"}
    });      
  }

}

