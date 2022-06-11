import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ListResponseModel } from '../models/listResponseModel';
import { UserOperationClaimModel } from './../models/userOperationClaimModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserOperationClaimService {

  constructor(@Inject('api') private api: string, private httpClient: HttpClient) { }


  getAllDto(userId: number, companyId: number) : Observable<ListResponseModel<UserOperationClaimModel>>{
    let url = this.api + 'UserOperationClaims/getAllDto?userId=' + userId + '&companyId=' + companyId
    return this.httpClient.get<ListResponseModel<UserOperationClaimModel>>(url)
  }

}
