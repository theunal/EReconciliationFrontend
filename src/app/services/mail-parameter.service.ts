import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SingleResponseModel } from '../models/singleResponseModel';
import { MailParameterModel } from './../models/mailParameterModel';
import { Observable } from 'rxjs';
import { ResponseModel } from './../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class MailParameterService {

  constructor(@Inject('api') private api: string, private httpClient: HttpClient) { }


  getMailParameters(companyId: number): Observable<SingleResponseModel<MailParameterModel>> {
    let url = this.api + 'MailParameters/getMailParameters?companyId=' + companyId
    return this.httpClient.get<SingleResponseModel<MailParameterModel>>(url)
  }

  updateMailParameter(mailParameter: MailParameterModel): Observable<ResponseModel> {
    let url = this.api + 'MailParameters/updateMailParameter'
    return this.httpClient.post<ResponseModel>(url, mailParameter)
  }

}
