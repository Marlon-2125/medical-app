import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})

export class InfraestructureService {
    urlEndpoints: string = 'https://autogestionterreno.com.co/api/infraestructure/';

    constructor(public _afStore: AngularFirestore, public _afAuth:AngularFireAuth) { }

    
    getInfraestructure(userId: string){
        const today = new Date();
        today.setHours(0,0,0,0);
        return this._afStore.collection("infraestructure", ref => ref.where('user_ID','==', userId).where('dateCreated','>', today).orderBy('dateCreated','desc')).snapshotChanges();
    }

    getAllInfraestructure(userId: string){
        return this._afStore.collection("infraestructure", ref => ref.where('user_ID','==', userId).orderBy('dateCreated','desc')).snapshotChanges();
    }

    getInfraestructureById(InfraestructureRequestId: string){
        return this._afStore.collection("infraestructure").doc(InfraestructureRequestId).valueChanges();
    }

    createInfraestructureRequest(data: any){
        return fetch(this.urlEndpoints,{
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(data),
            headers: {"Content-type": "application/json;charset=UTF-8"}
          });    
    }
}