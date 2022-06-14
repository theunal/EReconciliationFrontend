import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RegisterSecondDto } from 'src/app/models/DTOs/registerSecondDto';
import { UsersByCompanyDto } from 'src/app/models/DTOs/usersByCompanyDto';
import { UserOperationClaimModel } from 'src/app/models/userOperationClaimModel';
import { AuthService } from 'src/app/services/auth.service';
import { UserOperationClaimService } from 'src/app/services/user-operation-claim.service';
import { UserService } from 'src/app/services/user.service';
import * as XLSX from 'xlsx';
import { UserThemeModel } from './../../models/userThemeModel';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  jwtHelper: JwtHelperService = new JwtHelperService()
  userOperationClaims: UserOperationClaimModel[] = []
  users: UsersByCompanyDto[] = []
  userTheme: UserThemeModel

  active: boolean = false
  passive: boolean = false
  searchText: string = ''
  currentListText: string = 'Kullanıcı Listesi'

  companyName: string
  companyId: number
  userId: number

  userGetAll: boolean = false
  userGet: boolean = false
  userAdd: boolean = false
  userUpdate: boolean = false
  userDelete: boolean = false

  addUserForm: FormGroup
  checkboxTrue: boolean = true
  checkboxFalse: boolean = false

  updateUserForm: FormGroup
  checkboxUpdateTrue: boolean = false
  checkboxUpdateFalse: boolean = false

  updateUserId: number

  constructor(private authService: AuthService, private userOperationClaimService: UserOperationClaimService,
    private spinner: NgxSpinnerService, private toastrService: ToastrService, private userService: UserService) { }

  ngOnInit(): void {
    this.refresh()
    this.getUserOperationClaims()
    this.getUsers()
    this.createUserAddForm()
    this.createUserUpdateForm()
    this.getUserTheme()
  }

  refresh() {
    if (this.authService.isAuthenticated()) {
      let decode = this.jwtHelper.decodeToken(localStorage.getItem('token'))
      this.companyId = decode[Object.keys(decode).filter(x => x.endsWith('/anonymous'))[0]]
      this.userId = decode[Object.keys(decode).filter(x => x.endsWith('/nameidentifier'))[0]]
      this.companyName = decode[Object.keys(decode).filter(x => x.endsWith('/ispersistent'))[0]]
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

      if (res.data.find(x => x.operationClaimName == 'admin')) {
        this.userGetAll = true
        this.userGet = true
        this.userAdd = true
        this.userUpdate = true
        this.userDelete = true
      }
      if (res.data.find(x => x.operationClaimName == 'user.getall')) this.userGetAll = true
      if (res.data.find(x => x.operationClaimName == 'user.get')) this.userGet = true
      if (res.data.find(x => x.operationClaimName == 'user.add')) this.userAdd = true
      if (res.data.find(x => x.operationClaimName == 'user.update')) this.userUpdate = true
      if (res.data.find(x => x.operationClaimName == 'user.delete')) this.userDelete = true

    }, err => {
      this.spinner.hide()
      console.log(err)
    })
  }

  exportToExcel() {
    if (this.users.length > 0) {
      let currencyAccountTable = document.getElementById('currencyAccountTable')
      let ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(currencyAccountTable)
      let wb: XLSX.WorkBook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Cari Listesi')
      XLSX.writeFile(wb, `${this.currentListText} - ${this.companyName}.xlsx`)
    } else {
      this.toastrService.info('Cari Listesi Boş')
    }
  }

  getUsers() {
    this.userService.getAllDto(this.companyId).subscribe(res => {
      this.users = res.data
    }, err => {
      console.log(err)
    })
  }


  add() { }
  delete(user: any) { }

  // aktif pasif listesi
  activeCheck() {
    this.active == true ? this.passive = false : this.active = false
    this.active == true ? this.currentListText = 'Aktif Kullanıcı Listesi' : this.currentListText = 'Kullanıcı Listesi'
  }
  passiveCheck() {
    this.passive == true ? this.active = false : this.passive = false
    this.passive == true ? this.currentListText = 'Pasif Kullanıcı Listesi' : this.currentListText = 'Kullanıcı Listesi'
  }
  activePassiveStatus() {
    return this.active == true ? 'Aktif' : this.passive == true ? 'Pasif' : ''
  }
  // aktif pasif listesi

  // user add
  trueCheckbox() {
    this.checkboxTrue == true ? this.checkboxFalse = false : this.checkboxTrue = false
    this.checkboxTrue == false ? this.checkboxFalse = true : this.checkboxTrue = true
  }
  falseCheckbox() {
    this.checkboxFalse == true ? this.checkboxTrue = false : this.checkboxFalse = false
    this.checkboxFalse == false ? this.checkboxTrue = true : this.checkboxFalse = true
  }
  trueFalseStatus() {
    return this.checkboxTrue == true ? true : false
  }
  // user add

  // user update
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
  // user update


  createUserAddForm() {
    this.addUserForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)]),
      companyId: new FormControl(this.companyId),
    })
  }
  register() {
    this.spinner.show()
    if (this.addUserForm.valid) {
      let registerSecond = Object.assign({}, this.addUserForm.value)
      let registerSecondDto: RegisterSecondDto = {
        name: registerSecond.name,
        email: registerSecond.email,
        password: registerSecond.password,
        companyId: registerSecond.companyId,
      }
      this.userService.registerSecond(registerSecondDto).subscribe(res => {
        this.spinner.hide()
        this.toastrService.success('Kayıt Başarılı!', 'Success')
        this.getUsers()
        this.createUserAddForm()
        document.getElementById('userAddModal').click()
      }, err => {
        this.spinner.hide()
        this.toastrService.error(err.error)
      })
    } else {
      this.spinner.hide()
      this.toastrService.warning("lütfen bilgileri doldurun.")
    }
  }

  createUserUpdateForm() {
    this.updateUserForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl(''),
      isActive: new FormControl(this.trueFalseStatusUpdate())
    })
  }

  getById(id: number) {
    this.userService.getById(id).subscribe((res: any) => {
      this.updateUserId = id
      this.updateUserForm.setValue({
        name: res.name,
        email: res.email,
        password: '',
        isActive: res.isActive
      })
      if (res.isActive) {
        this.checkboxUpdateTrue = true
        this.checkboxUpdateFalse = false
      } else {
        this.checkboxUpdateTrue = false
        this.checkboxUpdateFalse = true
      }
    })
  }

  update() {
    if (this.updateUserForm.valid) {
      let user = Object.assign({}, this.updateUserForm.value)
      user.isActive = this.trueFalseStatusUpdate()
      user.userId = this.updateUserId
      this.userService.update(user).subscribe((res: any) => {
        this.getUsers()
        this.toastrService.success(res.message, user.name.toUpperCase())
        document.getElementById('userUpdateModal').click()
      }, err => {
        this.toastrService.warning(err.error.message, 'Uyarı')
      })
    } else {
      this.toastrService.warning("Gerekli yerleri boş bırakamazsınız.")
    }
  }

}
