import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  passwordResetForm: FormGroup
  value: string = ''

  status: boolean = false
  isActive: boolean = false
  message: string = ''

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService, private router: Router, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.createPasswordResetForm()
    this.activatedRoute.params.subscribe(res => {
      this.value = res['value']
    })
    this.confirmForgotPasswordValue()
  }

  createPasswordResetForm() {
    this.passwordResetForm = new FormGroup({
      password: new FormControl('', [Validators.required])
    })
  }

  passwordReset() {
    if (this.passwordResetForm.valid) {
      this.authService.passwordReset(this.value, this.passwordResetForm.value.password).subscribe((res: any) => {
        this.router.navigate(['/login'])
        this.toastrService.success(res.message)
      }, err => {
        this.toastrService.warning("Lütfen doğru şekilde bir şifre giriniz.")
      })
    } else {
      this.toastrService.warning("lütfen yeni şifrenizi giriniz.")
    }
  }










  // ikinci şfremi unuttum
  confirmForgotPasswordValue() { // valuenin aktifliğini kontrol ediyor
    this.spinner.show()
    this.authService.confirmForgotPasswordValue(this.value).subscribe((res: any) => {
      this.spinner.hide()
      this.status = true
      this.isActive = false
    }, err => {
      this.spinner.hide()
      this.status = true
      this.isActive = true
      this.message = err.error
    })
  }

  passwordReset2() {
    console.log(this.passwordResetForm.value.password)
    this.activatedRoute.params.subscribe(res => {
      this.value = res['value']
    })
    if (this.passwordResetForm.valid) {
      console.log(this.value)
      this.authService.passwordReset2(this.value, this.passwordResetForm.value.password).subscribe((res: any) => {
        this.router.navigate(['/login'])
        this.toastrService.success(res.message)
        console.log(res)
      }, err => {
        console.log(err)
        this.toastrService.warning("Lütfen doğru şekilde bir şifre giriniz.")
      })
    } else {
      this.toastrService.warning("lütfen yeni şifrenizi giriniz.")
    }
  }
  // ikinci şfremi unuttum







}
