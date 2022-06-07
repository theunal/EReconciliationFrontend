import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup

  constructor(private router: Router, private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.createLoginForm()
  }

  createLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)]),
    })
  }


  login() {
    if (this.loginForm.valid) {
      let login = Object.assign({}, this.loginForm.value)
      this.authService.login(login).subscribe(res => {
        console.log(res)
        localStorage.setItem('token', res.data.token)
        this.router.navigate(['/'])
        this.toastr.success('Giriş Yaptınız!', 'Success')
      }, err => {
        this.toastr.error(err.error)
      })
    } else {
      this.toastr.warning("lütfen bilgileri doldurun.")
    }
  }

  sleep(milliseconds: number) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

}
