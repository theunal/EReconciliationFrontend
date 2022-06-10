import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentAccountModel } from '../models/currentAccountModel';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class CurrencyAccountService {

  constructor(@Inject('api') private api: string, private httpClient: HttpClient) { }


  getCurrencyAccounts(companyId : number) : Observable<ListResponseModel<CurrentAccountModel>>{
    let url = this.api + 'CurrencyAccounts/getAllByCompanyId?companyId=' + companyId
    return this.httpClient.get<ListResponseModel<CurrentAccountModel>>(url)
  }

  delete(currencyAccountId : number) : Observable<ResponseModel> {
    let url = this.api + 'CurrencyAccounts/delete?id=' + currencyAccountId
    return this.httpClient.post<ResponseModel>(url,'')
  }

  add(currentAccount : CurrentAccountModel) : Observable<ResponseModel> {
    let url = this.api + 'CurrencyAccounts/add'
    return this.httpClient.post<ResponseModel>(url, currentAccount)
  }





}
