import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListResponseModel } from './../models/listResponseModel';
import { AccountReconciliationDto } from './../models/DTOs/accountReconciliationDto';
import { Observable, retry } from 'rxjs';
import { AccountReconciliationModel } from './../models/accountReconciliationModel';
import { ResponseModel } from './../models/responseModel';
import { SingleResponseModel } from './../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class AccountReconciliationService {

  constructor(@Inject('api') private api: string, private httpClient: HttpClient) { }


  getAllDto(companyId: number): Observable<ListResponseModel<AccountReconciliationDto>> {
    let url = this.api + 'AccountReconciliations/getAllDto?companyId=' + companyId
    return this.httpClient.get<ListResponseModel<AccountReconciliationDto>>(url)
  }

  getById(id: number): Observable<SingleResponseModel<AccountReconciliationDto>> {
    let url = this.api + 'AccountReconciliations/getById?id=' + id
    return this.httpClient.get<SingleResponseModel<AccountReconciliationDto>>(url)
  }

  add(accountReconciliation: AccountReconciliationModel): Observable<ResponseModel> {
    let url = this.api + 'AccountReconciliations/add'
    return this.httpClient.post<ResponseModel>(url, accountReconciliation)
  }

  update(accountReconciliation: AccountReconciliationModel, accountEmail: string, code : string): Observable<ResponseModel> {
    let url = this.api + 'AccountReconciliations/update?accountEmail=' + accountEmail + '&code=' + code
    return this.httpClient.post<ResponseModel>(url, accountReconciliation)
  }

  delete(id: number): Observable<ResponseModel> {
    let url = this.api + 'AccountReconciliations/delete?id=' + id
    return this.httpClient.post<ResponseModel>(url, '')
  }

  addByExcel(file: any, companyId: number): Observable<ResponseModel> {
    let url = this.api + 'AccountReconciliations/addByExcel?companyId=' + companyId
    let formData = new FormData()
    formData.append('file', file, file.name)
    return this.httpClient.post<ResponseModel>(url, formData)
  }

  sendReconciliationMail(accountReconciliationDto: AccountReconciliationDto): Observable<ResponseModel> {
    let url = this.api + 'AccountReconciliations/sendReconciliationMail'
    return this.httpClient.post<ResponseModel>(url, accountReconciliationDto)
  }

}
