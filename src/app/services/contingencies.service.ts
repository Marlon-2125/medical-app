import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})

export class ContingenciesService {
    urlEndpoints: string = 'https://autogestionterreno.com.co/api/contingencies/';

    constructor(public _afStore: AngularFirestore, public _afAuth:AngularFireAuth) { }

    
    getContingencies(userId: string){
        const today = new Date();
        today.setHours(0,0,0,0);
        return this._afStore.collection("contingencies", ref => ref.where('user_ID','==', userId).where('contingencies_Date','>', today).orderBy('contingencies_Date','desc')).snapshotChanges();
    }

    getAllContingencies(userId: string){
        return this._afStore.collection("contingencies", ref => ref.where('user_ID','==', userId).orderBy('contingencies_Date','desc')).snapshotChanges();
    }

    getContingencyById(contingencyId: string){
        return this._afStore.collection("contingencies").doc(contingencyId).valueChanges();
    }

    createContingency(data: any){
        return fetch(this.urlEndpoints,{
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(data),
            headers: {"Content-type": "application/json;charset=UTF-8"}
          });    
    }
}