import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { CurrencyAccountModel } from './../models/currencyAccountModel';

@Injectable({
  providedIn: 'root'
})
export class CurrencyAccountService {

  constructor(@Inject('api') private api: string, private httpClient: HttpClient) { }


  getCurrencyAccounts(companyId : number) : Observable<ListResponseModel<CurrencyAccountModel>>{
    let url = this.api + 'CurrencyAccounts/getAllByCompanyId?companyId=' + companyId
    return this.httpClient.get<ListResponseModel<CurrencyAccountModel>>(url)
  }








}
