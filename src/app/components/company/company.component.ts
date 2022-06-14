import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';
import { CompanyModel } from './../../models/companyModel';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserOperationClaimService } from 'src/app/services/user-operation-claim.service';
import { UserOperationClaimModel } from './../../models/userOperationClaimModel';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/services/company.service';
import { AddCompanyDto } from 'src/app/models/DTOs/addCompanyDto';
import { UserThemeModel } from './../../models/userThemeModel';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  jwtHelper: JwtHelperService = new JwtHelperService()
  userOperationClaims: UserOperationClaimModel[] = []
  companies: CompanyModel[] = []
  userTheme: UserThemeModel

  searchText: string = ''

  active: boolean = false
  passive: boolean = false
  currentListText: string = 'Şirket Listesi'

  companyGetall: boolean = false
  companyGet: boolean = false
  companyAdd: boolean = false
  companyUpdate: boolean = false
  companyDelete: boolean = false

  companyId: number
  userId: number

  companyUpdateForm: FormGroup
  checkboxUpdateTrue: boolean = false
  checkboxUpdateFalse: boolean = false

  companyAddForm: FormGroup

  constructor(private toastr: ToastrService, private authService: AuthService, private spinner: NgxSpinnerService,
    private userOperationClaimService: UserOperationClaimService, private userService: UserService,
    private companyService: CompanyService) { }

  ngOnInit(): void {
    this.refresh()
    this.getUserOperationClaims()
    this.getAllCompanyAdminUserId()
    this.createCompanyUpdate()
    this.createcompanyAdd()
    this.getUserTheme()
  }

  refresh() {
    if (this.authService.isAuthenticated()) {
      let decode = this.jwtHelper.decodeToken(localStorage.getItem('token'))
      this.companyId = decode[Object.keys(decode).filter(x => x.endsWith('/anonymous'))[0]]
      this.userId = decode[Object.keys(decode).filter(x => x.endsWith('/nameidentifier'))[0]]
    }
  }

  getUserTheme() {
    this.userService.getUserTheme(this.userId).subscribe(res => {
      this.userTheme = res.data
    }, err => {
      console.log(err)
    })
  }

  sidebarModeClass() {
    return 'sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-' +
      this.userTheme?.sidebarMode
  }

  getUserOperationClaims() {
    this.spinner.show()
    this.userOperationClaimService.getAllDto(this.userId, this.companyId).subscribe(res => {
      this.spinner.hide()
      this.userOperationClaims = res.data

      if (res.data.find(x => x.operationClaimName == 'company.getall')) this.companyGetall = true
      if (res.data.find(x => x.operationClaimName == 'company.get')) this.companyGet = true
      if (res.data.find(x => x.operationClaimName == 'company.add')) this.companyAdd = true
      if (res.data.find(x => x.operationClaimName == 'company.update')) this.companyUpdate = true
      if (res.data.find(x => x.operationClaimName == 'company.delete')) this.companyDelete = true

      if (res.data.find(x => x.operationClaimName == 'admin')) {
        this.companyGetall = true
        this.companyGet = true
        this.companyAdd = true
        this.companyUpdate = true
        this.companyDelete = true
      }
    }, err => {
      this.spinner.hide()
      console.log(err)
    })
  }

  exportToExcel() {
    if (this.companies.length > 0) {
      let currencyAccountTable = document.getElementById('currencyAccountTable')
      let ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(currencyAccountTable)
      let wb: XLSX.WorkBook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Cari Listesi')
      XLSX.writeFile(wb, `${this.currentListText}.xlsx`)
    } else {
      this.toastr.info('Cari Listesi Boş')
    }
  }

  // aktif pasif listesi
  activeCheck() {
    this.active == true ? this.passive = false : this.active = false
    this.active == true ? this.currentListText = 'Aktif Şirket Listesi' : this.currentListText = 'Şirket Listesi'
  }
  passiveCheck() {
    this.passive == true ? this.active = false : this.passive = false
    this.passive == true ? this.currentListText = 'Pasif Şirket Listesi' : this.currentListText = 'Şirket Listesi'
  }
  activePassiveStatus() {
    return this.active == true ? 'Aktif' : this.passive == true ? 'Pasif' : ''
  }
  // aktif pasif listesi

  // company update
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
  // company update

  getAllCompanyAdminUserId() {
    this.companyService.getAllCompanyAdminUserId(this.userId).subscribe(res => {
      this.companies = res.data
    })
  }

  createCompanyUpdate() {
    this.companyUpdateForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      taxDepartment: new FormControl('', [Validators.required]),
      taxIdNumber: new FormControl(''),
      isActive: new FormControl(''),
      addedAt: new FormControl(''),
    })
  }

  getById(companyId: number) {
    this.companyService.getCompany(companyId).subscribe(res => {
      this.companyUpdateForm.setValue({
        id: res.data.id,
        name: res.data.name,
        address: res.data.address,
        taxDepartment: res.data.taxDepartment,
        taxIdNumber: res.data.taxIdNumber,
        isActive: res.data.isActive,
        addedAt: res.data.addedAt
      })
      if (res.data.isActive) {
        this.checkboxUpdateTrue = true
        this.checkboxUpdateFalse = false
      } else {
        this.checkboxUpdateTrue = false
        this.checkboxUpdateFalse = true
      }
    })
  }

  update() {
    this.spinner.show()
    if (this.companyUpdateForm.valid) {
      let company: CompanyModel = this.companyUpdateForm.value
      company.isActive = this.trueFalseStatusUpdate()
      this.companyService.update(company).subscribe(res => {
        this.spinner.hide()
        this.toastr.success(res.message, this.companyUpdateForm.value.name)
        this.getAllCompanyAdminUserId()
        document.getElementById('companyUpdateModal').click()
        this.createCompanyUpdate()
      }, err => {
        this.spinner.hide()
        console.log(err)
      })
    } else {
      console.log('else e girdi')
      this.spinner.hide()
      this.toastr.warning('Lütfen gerekli alanları doldurunuz.')
    }
  }


  createcompanyAdd() {
    this.companyAddForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      taxDepartment: new FormControl('', [Validators.required]),
      taxIdNumber: new FormControl(''),
      identityNumber: new FormControl(''),
      addedAt: new FormControl(),
      isActive: new FormControl(true)
    })
  }

  addCompany() {
    if (this.companyAddForm.valid) {
      let company = Object.assign({}, this.companyAddForm.value)
      company.id = 0
      company.addedAt = new Date().toISOString(),
        company.isActive = true


      let dto: AddCompanyDto = {
        company: company,
        userId: this.userId
      }

      this.companyService.addCompanyToUser(dto).subscribe(res => {
        this.toastr.success(res.message, this.companyAddForm.value.name)
        this.getAllCompanyAdminUserId()
        document.getElementById('companyAddModal').click()
      }, err => {
        console.log(err)
      })
    } else {
      this.toastr.warning('Lütfen gerekli alanları doldurunuz.')
    }
  }





  delete(companyId: number) {
  }


}
