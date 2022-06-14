import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListResponseModel } from './../models/listResponseModel';
import { CurrencyModel } from '../models/currencyModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(@Inject('api') private api: string, private httpClient: HttpClient) { }

  getAllCurrencies(): Observable<ListResponseModel<CurrencyModel>> {
    let url = this.api + 'Curencies/getAllCurrencies'
    return this.httpClient.get<ListResponseModel<CurrencyModel>>(url)
  }


}
