import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationClaimModel } from '../models/operationClaimModel';
import { ListResponseModel } from './../models/listResponseModel';

@Injectable({
  providedIn: 'root'
})
export class OperationClaimService {

  constructor(@Inject('api') private api: string, private httpClient: HttpClient) { }


  getAll() : Observable<ListResponseModel<OperationClaimModel>>{
    let url = this.api + 'OperationClaims/getAll'
    return this.httpClient.get<ListResponseModel<OperationClaimModel>>(url)
  }



}
