import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})

export class QueueService {
    urlEndpoints: string = 'https://autogestionterreno.com.co/api/';

    constructor(public _afStore: AngularFirestore) { }

    createQueueItem(parameters: any, request_type: string, user_id: string) {
        let dataToSend:any = {
            parameters: parameters,
            request_type: request_type,
            user_id: user_id
        }
        return fetch(this.urlEndpoints + 'send-queue/',{
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(dataToSend),
            headers: {"Content-type": "application/json;charset=UTF-8"}
          }); 
    }

    getLastQueueItem(request_type: string, user_id: string) {
        return this._afStore.collection("request-orchestration", ref => ref.where('request_type', '==', request_type).where('user_id', '==', user_id)
            .orderBy("date_created", "desc")).snapshotChanges();
    }

    getResponseQueueByItem(request_id: string) {
        return fetch(this.urlEndpoints + 'response-queue-item/' + request_id,{
            method: 'GET',
            mode: 'cors',            
            headers: {"Content-type": "application/json;charset=UTF-8"}
          }); 
    }

}