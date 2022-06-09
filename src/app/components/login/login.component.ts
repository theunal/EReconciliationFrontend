import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup
  mailAgainForm: FormGroup

  constructor(private router: Router, private authService: AuthService, private toastr: ToastrService,
    private spinner : NgxSpinnerService) { }

  ngOnInit(): void {
    this.createLoginForm()
    this.createmailAgainForm()
  }

  createLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    })
  }

  createmailAgainForm() {
    this.mailAgainForm = new FormGroup({
      emailAgain: new FormControl('', [Validators.required, Validators.email])
    })
  }


  login() {
    this.spinner.show()
    if (this.loginForm.valid) {
      let login = Object.assign({}, this.loginForm.value)
      this.authService.login(login).subscribe(res => {
        this.spinner.hide()
        console.log(res)
        localStorage.setItem('token', res.data.token)
        this.router.navigate(['/'])
        this.toastr.success('Giriş Yaptınız!', 'Success')
      }, err => {
        this.spinner.hide()
        this.toastr.error(err.error)
      })
    } else {
      this.spinner.hide()
      this.toastr.warning("lütfen bilgileri doldurun.")
    }
  }

  confirmEmailAgain() {
    if (this.mailAgainForm.valid) {
      this.authService.confirmEmailAgain(this.mailAgainForm.value.emailAgain).subscribe((res: any) => {
        this.toastr.success(res.message)
      }, err => {
        this.toastr.warning(err.error.message)
      })
    } else {
      this.toastr.warning("lütfen mail adresinizi girin.")
    }
  }


  
  forgotPassword() {
    if (this.mailAgainForm.valid) {
      this.authService.forgotPassword(this.mailAgainForm.value.emailAgain).subscribe((res : any) => {
        this.toastr.success(res.message)
      }, err => {
       this.toastr.error(err.error.message)
      })
    } else {
      this.toastr.warning("lütfen mail adresinizi girin.")
    }
  }

    
  forgotPassword2() {
    this.spinner.show()
    if (this.mailAgainForm.valid) {
      this.authService.forgotPassword2(this.mailAgainForm.value.emailAgain).subscribe((res : any) => {
        this.spinner.hide()
        document.getElementById('modalClose').click() // maili gönderdikten sonra modalı kapatıyor
        this.toastr.success(res.message)
      }, err => {
        this.spinner.hide()
       this.toastr.error(err.error.message)
      })
    } else {
      this.spinner.hide()
      this.toastr.warning("lütfen mail adresinizi girin.")
    }
  }





}
