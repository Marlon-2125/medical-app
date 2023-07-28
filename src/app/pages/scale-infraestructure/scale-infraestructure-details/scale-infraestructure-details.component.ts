import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InfraestructureService } from 'src/app/services/infraestructure.service';

@Component({
  selector: 'app-scale-infraestructure-details',
  templateUrl: './scale-infraestructure-details.component.html',
  styleUrls: ['./scale-infraestructure-details.component.css']
})
export class ScaleInfraestructureDetailsComponent implements OnInit {

  infraestructureId: any;
  infraestructure: any = [];

  constructor(private _route: ActivatedRoute, private _infraestructureSvc: InfraestructureService) {
    this.infraestructureId = this._route.snapshot.params.id;
   }

  ngOnInit(): void {
    this.getInfraestructureById(this.infraestructureId);
  }

  getInfraestructureById(infraestructureId: string){
    this._infraestructureSvc.getInfraestructureById(infraestructureId).subscribe((data:any) => {
      this.infraestructure = data;
    });
  }

}
