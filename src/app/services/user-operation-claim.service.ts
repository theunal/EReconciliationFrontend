import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ListResponseModel } from '../models/listResponseModel';
import { UserOperationClaimModel } from './../models/userOperationClaimModel';
import { Observable } from 'rxjs';
import { UserOperationClaimUpdateDto } from '../models/DTOs/userOperationClaimUpdateDto';
import { ResponseModel } from './../models/responseModel';
import { SingleResponseModel } from './../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class UserOperationClaimService {

  constructor(@Inject('api') private api: string, private httpClient: HttpClient) { }


  getAllDto(userId: number, companyId: number): Observable<ListResponseModel<UserOperationClaimModel>> {
    let url = this.api + 'UserOperationClaims/getAllDto?userId=' + userId + '&companyId=' + companyId
    return this.httpClient.get<ListResponseModel<UserOperationClaimModel>>(url)
  }

  getUserOperationClaim(userId: number, operationClaimId: number, companyId: number): Observable<SingleResponseModel<UserOperationClaimModel>> {
    let url = this.api + 'UserOperationClaims/getUserOperationClaimByUserIdOperationClaimIdCompanyId' +
      '?userId=' + userId + '&operationClaimId=' + operationClaimId + '&companyId=' + companyId
    return this.httpClient.get<SingleResponseModel<UserOperationClaimModel>>(url)
  }

  userOperationClaimUpdate(dto : UserOperationClaimUpdateDto) {
    let url = this.api + 'UserOperationClaims/userOperationClaimUpdate'
    return this.httpClient.post(url, dto)
  }
  
}
