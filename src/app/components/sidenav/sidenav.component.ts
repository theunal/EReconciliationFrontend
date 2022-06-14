import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/services/auth.service';
import { UserOperationClaimService } from 'src/app/services/user-operation-claim.service';
import { UserService } from 'src/app/services/user.service';
import { UserThemeModel } from './../../models/userThemeModel';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MailParameterModel } from './../../models/mailParameterModel';
import { MailParameterService } from './../../services/mail-parameter.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  jwtHelper: JwtHelperService = new JwtHelperService()
  userTheme: UserThemeModel

  name: string
  companyName: string
  companyId: number
  userId: number
  currentUrl: string

  currentAccountMenu: boolean = false
  userMenu: boolean = false
  companyMenu: boolean = false
  mailParameterMenu: boolean = false
  mailTemplateMenu: boolean = false
  accountReconciliationMenu: boolean = false
  babsReconciliationMenu: boolean = false

  mailParameterForm: FormGroup
  checkboxUpdateTrue: boolean = false
  checkboxUpdateFalse: boolean = false

  mailTemplateForm: FormGroup


  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute,
    private userOperationClaimService: UserOperationClaimService, private userService: UserService,
    private mailParameterService: MailParameterService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.refresh()
    this.currentUrl = this.activatedRoute.snapshot.routeConfig.path
    this.getUserOperationClaims()
    this.getUserTheme()
    this.createMailParameter()
  }

  refresh() {
    if (this.authService.isAuthenticated()) {
      let token = localStorage.getItem('token')
      let decode = this.jwtHelper.decodeToken(token)
      //this.name = decode['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
      this.name = decode[Object.keys(decode).filter(x => x.endsWith('/name'))[0]] // iki türlü de yapılabilir
      this.companyId = decode[Object.keys(decode).filter(x => x.endsWith('/anonymous'))[0]]
      this.userId = decode[Object.keys(decode).filter(x => x.endsWith('/nameidentifier'))[0]]
      // anonymous >> şirket id
      // ispersistent >> şirket adı
    }
  }

  getUserTheme() {
    this.userService.getUserTheme(this.userId).subscribe(res => {
      this.userTheme = res.data
    }, err => {
      console.log(err)
    })
  }


  logout() {
    localStorage.removeItem('token')
    this.authService.isAuthenticated()
    this.router.navigate(['/login'])
  }

  sidenavButtonClass(url: string) {
    if (this.currentUrl == url) {
      return 'nav-link text-white active bg-gradient-' + this.userTheme?.sidebarButtonColor
    }
    return 'nav-link text-white'
  }

  sidebarButtonTextClass(url: string) {
    if (this.userTheme?.sidebarButtonColor == 'light' && url == this.currentUrl) {
      return 'nav-link-text ms-1 text-dark'
    } else return 'nav-link-text ms-1 '
  }

  sidebarTextClass() {
    if (this.userTheme?.sidebarMode == 'gradient-dark') {
      return 'fas fa-times p-3 cursor-pointer opacity-5 position-absolute end-0 top-0 d-none d-xl-none text-white'
    } else {
      return 'fas fa-times p-3 cursor-pointer opacity-5 position-absolute end-0 top-0 d-none d-xl-none text-dark'
    }
  }

  sidebarUserNameTextClass() {
    if (this.userTheme?.sidebarMode == 'gradient-dark') {
      return 'ms-1 font-weight-bold text-white'
    } else {
      return 'ms-1 font-weight-bold text-dark'
    }
  }

  sidebarIconClass() {
    if (this.userTheme?.sidebarMode == 'gradient-dark') {
      return 'text-white text-center me-2 d-flex align-items-center justify-content-center'
    } else {
      return 'text-dark text-center me-2 d-flex align-items-center justify-content-center'
    }
  }

  sidebarHeaderClass() {
    if (this.userTheme?.sidebarMode == 'gradient-dark') {
      return 'ps-4 ms-2 text-uppercase text-xs text-white font-weight-bolder opacity-8'
    } else {
      return 'ps-4 ms-2 text-uppercase text-xs text-white font-weight-bolder opacity-8'
    }
  }

  getUserOperationClaims() {

    this.userOperationClaimService.getAllDto(this.userId, this.companyId).subscribe(res => {
      if (res.data.find(x => x.operationClaimName == 'currentAccountMenu'))
        this.currentAccountMenu = true
      if (res.data.find(x => x.operationClaimName == 'userMenu'))
        this.userMenu = true
      if (res.data.find(x => x.operationClaimName == 'companyMenu'))
        this.companyMenu = true
      if (res.data.find(x => x.operationClaimName == 'mailParameterMenu'))
        this.mailParameterMenu = true
      if (res.data.find(x => x.operationClaimName == 'mailTemplateMenu'))
        this.mailTemplateMenu = true
      if (res.data.find(x => x.operationClaimName == 'accountReconciliationMenu'))
        this.accountReconciliationMenu = true
      if (res.data.find(x => x.operationClaimName == 'babsReconciliationMenu'))
        this.babsReconciliationMenu = true
      if (res.data.find(x => x.operationClaimName == 'admin')) {
        this.currentAccountMenu = true
        this.userMenu = true
        this.companyMenu = true
        this.mailParameterMenu = true
        this.mailTemplateMenu = true
        this.accountReconciliationMenu = true
        this.babsReconciliationMenu = true
      }
    }, err => {
      console.log(err)
    })
  }


  createMailParameter() {
    this.mailParameterForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      companyId: new FormControl(this.companyId, [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl(''),
      smtp: new FormControl('', [Validators.required]),
      port: new FormControl('', [Validators.required]),
      ssl: new FormControl('')
    })
  }

  // mail parameter 
  trueCheckboxUpdate() {
    this.checkboxUpdateTrue == true ? this.checkboxUpdateFalse = false : this.checkboxUpdateTrue = false
    this.checkboxUpdateTrue == false ? this.checkboxUpdateFalse = true : this.checkboxUpdateTrue = true
  }
  falseCheckboxUpdate() {
    this.checkboxUpdateFalse == true ? this.checkboxUpdateTrue = false : this.checkboxUpdateFalse = false
    this.checkboxUpdateFalse == false ? this.checkboxUpdateTrue = true : this.checkboxUpdateFalse = true
  }
  trueFalseStatusUpdate() {
    return this.checkboxUpdateTrue == true ? true : false
  }
  // mail parameter 

  getMailParameters() {
    this.mailParameterService.getMailParameters(this.companyId).subscribe(res => {
      this.mailParameterForm.setValue({
        id: res.data.id,
        companyId: res.data.companyId,
        email: res.data.email,
        password: '',
        smtp: res.data.smtp,
        port: res.data.port,
        ssl: res.data.ssl
      })
      if (res.data.ssl) {
        this.checkboxUpdateTrue = true
        this.checkboxUpdateFalse = false
      } else {
        this.checkboxUpdateTrue = false
        this.checkboxUpdateFalse = true
      }
    }, err => {
      this.mailParameterForm.setValue({
        id: '',
        companyId: '',
        email: '',
        password: '',
        smtp: '',
        port: '',
        ssl: '',
      })
      console.log(err)
    })
  }

  mailParameterUpdate() {
    if (this.mailParameterForm.valid) {
      let mailParameter: MailParameterModel = Object.assign({}, this.mailParameterForm.value)
      mailParameter.ssl = this.trueFalseStatusUpdate()
      this.mailParameterService.updateMailParameter(mailParameter).subscribe(res => {
        this.toastr.success(res.message)
        document.getElementById('mailParameterModal').click()
      }, err => {
        console.log(err)
      })
    } else {
      this.toastr.warning('Lütfen gerekli alanları doldurunuz.')
    }

  }













}
