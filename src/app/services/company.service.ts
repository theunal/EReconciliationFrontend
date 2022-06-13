import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SingleResponseModel } from '../models/singleResponseModel';
import { CompanyModel } from '../models/companyModel';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/responseModel';
import { AddCompanyDto } from '../models/DTOs/addCompanyDto';
import { ListResponseModel } from '../models/listResponseModel';
import { ChangeCompanyDto } from '../models/DTOs/changeCompanyDto';
import { TokenModel } from '../models/tokenModel';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(@Inject('api') private api: string, private httpClient: HttpClient) { }

  getAllCompanyAdminUserId(adminUserId: number): Observable<ListResponseModel<CompanyModel>> {
    let url = this.api + 'Users/getAllCompanyAdminUserId?adminUserId=' + adminUserId
    return this.httpClient.get<ListResponseModel<CompanyModel>>(url)
  }

  getCompany(companyId: number): Observable<SingleResponseModel<CompanyModel>> {
    let url = this.api + 'Companies/getCompany?id=' + companyId
    return this.httpClient.get<SingleResponseModel<CompanyModel>>(url)
  }

  update(company: CompanyModel): Observable<ResponseModel> {
    let url = this.api + 'Companies/updateCompany'
    return this.httpClient.post<ResponseModel>(url, company)
  }

  addCompanyToUser(dto: AddCompanyDto): Observable<ResponseModel> {
    let url = this.api + 'Companies/addCompanyToUser'
    return this.httpClient.post<ResponseModel>(url, dto)
  }

  changeCompany(dto: ChangeCompanyDto): Observable<SingleResponseModel<TokenModel>> {
    let url = this.api + 'Companies/changeCompany'
    return this.httpClient.post<SingleResponseModel<TokenModel>>(url, dto)
  }


}
