
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RegisterDto } from 'src/app/models/DTOs/registerDto';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup
  checkbox : boolean = false
  confirmEmail : string = ''


  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.createRegisterForm()
  }

  createRegisterForm() {
    this.registerForm = new FormGroup({

      // user
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)]),

      // company
      companyName: new FormControl('', [Validators.required]),
      companyAddress: new FormControl('', [Validators.required]),
      companyTaxDepartment: new FormControl('', [Validators.required]),
      companyTaxIdNumber: new FormControl(''),
      identityNumber: new FormControl(''),
      addedAt: new FormControl(),
      isActive: new FormControl(true)

    })
  }

  register() {
    this.spinner.show()
    if (this.checkbox && this.registerForm.valid) {
      console.log(this.confirmEmail)
      let register = Object.assign({}, this.registerForm.value)
      let registerDto: RegisterDto = {
        userRegisterDto: {
          name: register.name,
          email: register.email,
          password: register.password,
        },
        company: {
          id: 0,
          name: register.companyName,
          address: register.companyAddress,
          taxDepartment: register.companyTaxDepartment,
          taxIdNumber: register.companyTaxIdNumber,
          identityNumber: register.identityNumber,
          addedAt: new Date().toISOString(),
          isActive: true
        }
      }
      this.authService.register(registerDto).subscribe(res => {
        this.spinner.hide()
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('mail', this.registerForm.value.email)
        // this.router.navigate(['/'])
        this.toastr.success('Kayıt Başarılı!', 'Success')
        
        // this.confirmEmail = this.registerForm.value.email
        this.confirmEmail = localStorage.getItem('mail')
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
    this.spinner.show()
    this.authService.confirmEmailAgain(localStorage.getItem('mail').toString()).subscribe((res: any) => {
      this.spinner.hide()
      this.toastr.success(res.message)
    }, err => {
      if (err.error.message == 'Mail zaten onaylanmış.') {
        this.router.navigate(['/login'])
        this.spinner.hide()
        this.toastr.success(err.error.message)
      } else {
        this.spinner.hide()
        this.toastr.warning(err.error.message)
      }
    })
  }



}
