import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueueService } from 'src/app/services/queue.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-incomplete-dashboard',
  templateUrl: './incomplete-dashboard.component.html',
  styleUrls: ['./incomplete-dashboard.component.css']
})

export class IncompleteDashboardComponent implements OnInit {

  loading: boolean = false;

  loadingData: boolean = false;

  dataResponse: any;

  userId: any;

  subscriptionQueue: Subscription = new Subscription();
  
  incompleteSearchForm = new FormGroup ({
    task: new FormControl('', Validators.required)
  });

  constructor(private _router:Router, private _queueService: QueueService) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem("user_id");
    this.dataResponse = {
      request_id: '',
      code: 0,
      message: '',
      data: '',
      response: '',
      status: '',
      title: ''
    };
  }

  viewDetails(){
    this._router.navigate(['/incomplete/incomplete-details']);
  }

  onSubmit(){
    this.clearData();
    this.loadingData = true;
    this.loading = true;
    if(this.incompleteSearchForm.controls.task.value.length > 0){
      this._queueService.createQueueItem(this.incompleteSearchForm.controls.task.value, "CODINC", this.userId)
        .then((res) => {
          return res.json()
        })
        .then((response) => {
          if(response.code == 200){
            this.subscriptionQueue = this._queueService.getLastQueueItem("CODINC", this.userId).pipe(
              map(actions => {
                return actions.map(
                  (data:any) => ({
                    request_id: data.payload.doc.id,
                    status: data.payload.doc.data().status
                  }));
              }))
            .subscribe((res:any) => {
              console.log("Estoy cambiando..");
              if(res[0].status == 'Finalizado'){
                this._queueService.getResponseQueueByItem(res[0].request_id)
                  .then((res) => {
                    return res.json()
                  })
                  .then((response) => {                    
                    this.dataResponse.code = response.data[0].code;
                    this.dataResponse.request_id = response.data[0].request_id;
                    this.dataResponse.message = response.data[0].message;
                    this.dataResponse.data = response.data[0].data;
                    
                    if(response.data[0].code == 200){
                      this.dataResponse.status = 'check';
                      this.dataResponse.title = 'Solicitud Finalizada';
                      this.dataResponse.response = 'El código incompleto para la tarea es: ' + this.dataResponse.data;
                    } else if(response.data[0].code == 500){
                      this.dataResponse.status = 'warning';
                      this.dataResponse.title = 'El servidor está experimentando alto flujo de datos reintenta en unos minutos';
                      this.dataResponse.response = this.dataResponse.message;
                    }
                    else {
                      this.dataResponse.status = 'warning';
                      this.dataResponse.title = 'La tarea no cumple con los requisitos';
                      this.dataResponse.response = this.dataResponse.message;
                    }
                    console.log("RESPUESTA");
                    console.log(response);
                    console.log("RESPUESTA MAPEADA");
                    console.log(this.dataResponse);
                    this.subscriptionQueue.unsubscribe();
                    this.loadingData = false;
                    this.loading = false;
                  })
                  .catch((err) => {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: '¡Ha ocurrido un error en la respuesta, porfavor recargue la aplicación!' + err.toString()
                    })
                  });
                
              }
            });          
          } else {
            Swal.fire({
              icon: 'info',
              title: 'Oops...',
              text: response.message
            })
            this.loadingData = false;
            this.loading = false;
          }        
        })
        .catch((err) => {
          Swal.fire({
            icon: 'info',
            title: 'Oops...',
            text: err
          })
          this.loadingData = false;
          this.loading = false;
        });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: '¡Por favor ingresa el campo tarea!'
      })
      this.loadingData = false;
      this.loading = false;
    }
  }

  clearData() {
    this.dataResponse.code = '';
    this.dataResponse.request_id = '';
    this.dataResponse.message = '';
    this.dataResponse.data = '';
    this.dataResponse.status = '';
    this.dataResponse.title = '';
    this.dataResponse.response = '';
    this.subscriptionQueue.unsubscribe();
  }

}

