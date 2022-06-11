import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserOperationClaimModel } from 'src/app/models/userOperationClaimModel';
import { AuthService } from 'src/app/services/auth.service';
import { UserOperationClaimService } from 'src/app/services/user-operation-claim.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  jwtHelper: JwtHelperService = new JwtHelperService()
  userOperationClaims: UserOperationClaimModel[] = []
  users: any[] = []

  active: boolean = false
  passive: boolean = false
  searchText: string = ''
  currentListText: string = 'Kullanıcı Listesi'

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

  constructor(private authService: AuthService, private userOperationClaimService: UserOperationClaimService,
    private spinner: NgxSpinnerService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.refresh()
    this.getUserOperationClaims()
  }

  refresh() {
    if (this.authService.isAuthenticated()) {
      let decode = this.jwtHelper.decodeToken(localStorage.getItem('token'))
      this.companyId = decode[Object.keys(decode).filter(x => x.endsWith('/anonymous'))[0]]
      this.userId = decode[Object.keys(decode).filter(x => x.endsWith('/nameidentifier'))[0]]
    }
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
      XLSX.writeFile(wb, `${this.currentListText}.xlsx`)
    } else {
      this.toastrService.info('Cari Listesi Boş')
    }
  }

  getById(id: number) { }
  add() { }
  update() { }
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








}
