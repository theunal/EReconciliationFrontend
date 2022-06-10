import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterDto } from '../models/DTOs/registerDto';
import { LoginModel } from '../models/loginModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from './../models/tokenModel';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  isAuth : boolean = false

  constructor(@Inject('api') private api : string, private httpClient : HttpClient, private router : Router,
  private toastrService : ToastrService) { }

  isAuthenticated() {
    if (localStorage.getItem('token')) {
      this.isAuth = true
    } else {
      this.isAuth = false
    }
    return this.isAuth
  }

  login(login : LoginModel) : Observable<SingleResponseModel<TokenModel>> {
    let url = this.api + 'Auth/login'
    return this.httpClient.post<SingleResponseModel<TokenModel>>(url, login)
  }

 logout() {
    localStorage.removeItem('token')
    this.isAuth = false
    this.router.navigate(['/login'])
    this.toastrService.error('Bir Hata oluştu.')
  }


  register(register : RegisterDto) : Observable<SingleResponseModel<TokenModel>> {
    let url = this.api + 'Auth/register'
    return this.httpClient.post<SingleResponseModel<TokenModel>>(url, register)
  }

  confirmEmailAgain(email : string) {
    let url = this.api + 'Auth/confirmUserAgain?email='+ email
    return this.httpClient.get(url)
  }
  
  confirmUser(value : string) {
    let url = this.api + 'Auth/confirmUser?value='+ value
    return this.httpClient.get(url)
  }





  /* birinci şifre kısmı */
  forgotPassword(email : string) {
    let url = this.api + 'Auth/forgotPassword?email=' + email
    return this.httpClient.post(url,'')
  }
  
  passwordReset(value : string, password : string) {
    let url = this.api + 'Auth/passwordReset?value=' + value + '&password=' + password
    return this.httpClient.get(url)
  }
  /* birinci şifre kısmı */
 



  /* ikini şifre kısmı */

  forgotPassword2(email : string) {
    let url = this.api + 'Auth/forgotPassword?email=' + email
    return this.httpClient.post(url,'')
  }

  confirmForgotPasswordValue(value : string) {
    let url = this.api + 'Auth/forgotPasswordLinkCheck?value=' + value
    return this.httpClient.get(url)
  }

  passwordReset2(value : string, password : string) {
    let url = this.api + 'Auth/passwordReset2?value=' + value + '&password=' + password
    return this.httpClient.get(url)
  }

  /* ikini şifre kısmı */




}
