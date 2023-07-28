import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContingenciesService } from 'src/app/services/contingencies.service';

@Component({
  selector: 'app-contingency-details',
  templateUrl: './contingency-details.component.html',
  styleUrls: ['./contingency-details.component.css']
})
export class ContingencyDetailsComponent implements OnInit {

  contingencyId: any;
  contingency: any = [];

  constructor(private _route: ActivatedRoute, private _contingencySvc: ContingenciesService) {
    this.contingencyId = this._route.snapshot.params.id;
   }

  ngOnInit(): void {
    this.getContingencyById(this.contingencyId);
  }

  getContingencyById(contingencyId: string){
    this._contingencySvc.getContingencyById(contingencyId).subscribe((data:any) => {
      this.contingency = data;
    });
  }

}
