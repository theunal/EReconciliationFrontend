import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SingleResponseModel } from '../models/singleResponseModel';
import { CompanyModel } from '../models/companyModel';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/responseModel';
import { AddCompanyDto } from '../models/DTOs/addCompanyDto';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(@Inject('api') private api: string, private httpClient: HttpClient) { }


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



}
