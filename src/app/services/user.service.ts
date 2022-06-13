import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyModel } from '../models/companyModel';
import { AdminCompaniesDto } from '../models/DTOs/adminCompaniesDto';
import { RegisterSecondDto } from '../models/DTOs/registerSecondDto';
import { UserOperationClaimUpdateDto } from '../models/DTOs/userOperationClaimUpdateDto';
import { UserRelationshipDto } from '../models/DTOs/userRelationshipDto';
import { UsersByCompanyDto } from '../models/DTOs/usersByCompanyDto';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from '../models/tokenModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(@Inject('api') private api: string, private httpClient: HttpClient) { }


  getAllDto(companyId: number): Observable<ListResponseModel<UsersByCompanyDto>> {
    let url = this.api + 'Users/getAllByCompanyId?companyId=' + companyId
    return this.httpClient.get<ListResponseModel<UsersByCompanyDto>>(url)
  }

  GetAllUserRelationshipByAdminUserId(adminUserId: number): Observable<ListResponseModel<UserRelationshipDto>> {
    let url = this.api + 'Users/getAllUserRelationshipByAdminUserId?adminUserId=' + adminUserId
    return this.httpClient.get<ListResponseModel<UserRelationshipDto>>(url)
  }

  GetUserRelationshipByUserUserId(userUserId: number): Observable<SingleResponseModel<UserRelationshipDto>> {
    let url = this.api + 'Users/getUserRelationshipByUserUserId?userUserId=' + userUserId
    return this.httpClient.get<SingleResponseModel<UserRelationshipDto>>(url)
  }

  getById(id: number): Observable<SingleResponseModel<UsersByCompanyDto>> {
    let url = this.api + 'Users/getById?id=' + id
    return this.httpClient.get<SingleResponseModel<UsersByCompanyDto>>(url)
  }

  registerSecond(registerSecond: RegisterSecondDto) {
    let url = this.api + 'Auth/registerSecond'
    return this.httpClient.post<SingleResponseModel<TokenModel>>(url, registerSecond)
  }

  update(user: UsersByCompanyDto): Observable<ResponseModel> {
    let url = this.api + 'Users/update'
    return this.httpClient.post<ResponseModel>(url, user)
  }

  getUserIdByValue(value: string): Observable<number> {
    let url = this.api + 'Users/getByValue?value=' + value
    return this.httpClient.get<number>(url)
  }

  deleteByUserIdAndCompanyId(dto: UserOperationClaimUpdateDto): Observable<ResponseModel> {
    let url = this.api + 'Users/deleteByUserIdAndCompanyId'
    return this.httpClient.post<ResponseModel>(url, dto)
  }

  getAdminCompanies(adminUserId: number, userUserId: number): Observable<ListResponseModel<AdminCompaniesDto[]>> {
    let url = this.api + 'Users/getAdminCompanies?adminUserId=' + adminUserId + '&userUserId=' + userUserId
    return this.httpClient.get<ListResponseModel<AdminCompaniesDto[]>>(url)
  }



 
}
