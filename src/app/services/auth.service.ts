import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterDto } from '../models/DTOs/registerDto';
import { LoginModel } from '../models/loginModel';
import { ResponseModel } from '../models/responseModel';
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


  register(register : RegisterDto) : Observable<SingleResponseModel<TokenModel>> {
    let url = 'https://localhost:7154/api/Auth/register'
    return this.httpClient.post<SingleResponseModel<TokenModel>>(url, register)
  }

  confirmEmailAgain(email : string) {
    let url = 'https://localhost:7154/api/Auth/confirmUserAgain?email='+ email
    return this.httpClient.get(url)
  }
  
  confirmUser(value : string) {
    let url = 'https://localhost:7154/api/Auth/confirmUser?value='+ value
    return this.httpClient.get(url)
  }





  /* birinci şifre kısmı */
  forgotPassword(email : string) {
    let url = 'https://localhost:7154/api/Auth/forgotPassword?email=' + email
    return this.httpClient.post(url,'')
  }
  
  passwordReset(value : string, password : string) {
    let url = 'https://localhost:7154/api/Auth/passwordReset?value=' + value + '&password=' + password
    return this.httpClient.get(url)
  }
  /* birinci şifre kısmı */
 



  /* ikini şifre kısmı */

  forgotPassword2(email : string) {
    let url = 'https://localhost:7154/api/Auth/forgotPassword?email=' + email
    return this.httpClient.post(url,'')
  }

  confirmForgotPasswordValue(value : string) {
    let url = 'https://localhost:7154/api/Auth/forgotPasswordLinkCheck?value=' + value
    return this.httpClient.get(url)
  }

  passwordReset2(value : string, password : string) {
    let url = 'https://localhost:7154/api/Auth/passwordReset2?value=' + value + '&password=' + password
    return this.httpClient.get(url)
  }

  /* ikini şifre kısmı */




}
