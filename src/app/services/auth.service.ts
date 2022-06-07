import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginModel } from '../models/loginModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from './../models/tokenModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth : boolean = false

  constructor(private httpClient : HttpClient) { }

  isAuthenticated() {
    if (localStorage.getItem('token')) {
      this.isAuth = true
    } else {
      this.isAuth = false
    }
    return this.isAuth
  }

  login(login : LoginModel) : Observable<SingleResponseModel<TokenModel>> {
    let url = 'https://localhost:7154/api/Auth/login'
    return this.httpClient.post<SingleResponseModel<TokenModel>>(url, login)
  }

 logout() {
    localStorage.removeItem('token')
    this.isAuth = false
    // this.router.navigate(['/'])
  }


}
