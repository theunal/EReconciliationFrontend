import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterSecondDto } from '../models/DTOs/registerSecondDto';
import { UserDto } from '../models/DTOs/userDto';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from '../models/tokenModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(@Inject('api') private api: string, private httpClient: HttpClient) { }


  getAllDto(companyId: number): Observable<ListResponseModel<UserDto>> {
    let url = this.api + 'Users/getAllByCompanyId?companyId=' + companyId
    return this.httpClient.get<ListResponseModel<UserDto>>(url)
  }

  getById(id: number): Observable<SingleResponseModel<UserDto>> {
    let url = this.api + 'Users/getById?id=' + id
    return this.httpClient.get<SingleResponseModel<UserDto>>(url)
  }

  registerSecond(registerSecond: RegisterSecondDto) {
    let url = this.api + 'Auth/registerSecond'
    return this.httpClient.post<SingleResponseModel<TokenModel>>(url, registerSecond)
  }

  update(user: UserDto) : Observable<ResponseModel>{
    let url = this.api + 'Users/update'
    return this.httpClient.post<ResponseModel>(url, user)
  }

  getUserIdByValue(value: string) : Observable<number> {
    let url = this.api + 'Users/getByValue?value=' + value
    return this.httpClient.get<number>(url)
  }



}
