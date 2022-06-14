import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentAccountModel } from '../models/currentAccountModel';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CurrentAccountService {

  constructor(@Inject('api') private api: string, private httpClient: HttpClient) { }


  getCurrencyAccounts(companyId: number): Observable<ListResponseModel<CurrentAccountModel>> {
    let url = this.api + 'CurrentAccounts/getAllByCompanyId?companyId=' + companyId
    return this.httpClient.get<ListResponseModel<CurrentAccountModel>>(url)
  }

  delete(currencyAccountId: number): Observable<ResponseModel> {
    let url = this.api + 'CurrentAccounts/delete?id=' + currencyAccountId
    return this.httpClient.post<ResponseModel>(url, '')
  }

  add(currentAccount: CurrentAccountModel): Observable<ResponseModel> {
    let url = this.api + 'CurrentAccounts/add'
    return this.httpClient.post<ResponseModel>(url, currentAccount)
  }

  getById(id: number): Observable<SingleResponseModel<CurrentAccountModel>> {
    let url = this.api + 'CurrentAccounts/getById?id=' + id
    return this.httpClient.get<SingleResponseModel<CurrentAccountModel>>(url)
  }

  update(currentAccount: CurrentAccountModel): Observable<ResponseModel> {
    let url = this.api + 'CurrentAccounts/update'
    return this.httpClient.post<ResponseModel>(url, currentAccount)
  }

  addFromExcel(file: any, companyId: number): Observable<ResponseModel> {
    let url = this.api + 'CurrentAccounts/addByExcel?companyId=' + companyId
    let formData = new FormData()
    formData.append('file', file, file.name)
    return this.httpClient.post<ResponseModel>(url, formData)
  }







}
