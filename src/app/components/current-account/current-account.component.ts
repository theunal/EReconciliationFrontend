import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CurrentAccountModel } from 'src/app/models/currentAccountModel';
import { AuthService } from 'src/app/services/auth.service';
import { CurrentAccountService } from 'src/app/services/current-account.service';
import { UserOperationClaimService } from 'src/app/services/user-operation-claim.service';
import * as XLSX from 'xlsx';
import { UserOperationClaimModel } from './../../models/userOperationClaimModel';

@Component({
  selector: 'app-current-account',
  templateUrl: './current-account.component.html',
  styleUrls: ['./current-account.component.css']
})
export class CurrentAccountComponent implements OnInit {

  jwtHelper: JwtHelperService = new JwtHelperService()
  currentAccounts: CurrentAccountModel[] = []
  currentAccount: CurrentAccountModel
  userOperationClaims: UserOperationClaimModel[] = []
  companyId: number
  userId: number
  searchText: string = ''

  currentAccountUpdateForm: FormGroup
  checkboxUpdateTrue: boolean = false
  checkboxUpdateFalse: boolean = false
  currentAccountId: number

  addCurrencyAccountForm: FormGroup
  checkboxTrue: boolean = true
  checkboxFalse: boolean = false

  active: boolean = false
  passive: boolean = false
  currentListText: string = 'Cari Listesi'

  file: string = ''

  currentAccountGetall: boolean = false
  currentAccountGet: boolean = false
  currentAccountAdd: boolean = false
  currentAccountUpdate: boolean = false
  currentAccountDelete: boolean = false


  constructor(private currencyAccountService: CurrentAccountService, private authService: AuthService,
    private spinner: NgxSpinnerService, private toastrService: ToastrService,
    private userOperationClaimService: UserOperationClaimService) { }

  ngOnInit(): void {
    this.refresh()
    this.getUserOperationClaims()
    this.getCurrencyAccounts()
    this.createCurrentAccountUpdate()
    this.createCurrentAccountAdd()
  }

  refresh() {
    if (this.authService.isAuthenticated()) {
      let decode = this.jwtHelper.decodeToken(localStorage.getItem('token'))
      this.companyId = decode[Object.keys(decode).filter(x => x.endsWith('/anonymous'))[0]]
      this.userId = decode[Object.keys(decode).filter(x => x.endsWith('/nameidentifier'))[0]]
    }
  }

  getCurrencyAccounts() {
    this.spinner.show()
    this.currencyAccountService.getCurrencyAccounts(this.companyId).subscribe(res => {
      this.spinner.hide()
      this.currentAccounts = res.data
    }, err => {
      this.spinner.hide()
      // this.authService.logout()
      console.log(err)
    })
  }

  getUserOperationClaims() {
    this.spinner.show()
    this.userOperationClaimService.getAllDto(this.userId, this.companyId).subscribe(res => {
      this.spinner.hide()
      this.userOperationClaims = res.data

      if (res.data.find(x => x.operationClaimName == 'currentAccount.getall')) this.currentAccountGetall = true
      if (res.data.find(x => x.operationClaimName == 'currentAccount.get')) this.currentAccountGet = true
      if (res.data.find(x => x.operationClaimName == 'currentAccount.add')) this.currentAccountAdd = true
      if (res.data.find(x => x.operationClaimName == 'currentAccount.update')) this.currentAccountUpdate = true
      if (res.data.find(x => x.operationClaimName == 'currentAccount.delete')) this.currentAccountDelete = true

      if (res.data.find(x => x.operationClaimName == 'admin')) {
        this.currentAccountGetall = true
        this.currentAccountGet = true
        this.currentAccountAdd = true
        this.currentAccountUpdate = true
        this.currentAccountDelete = true
      }
    }, err => {
      this.spinner.hide()
      console.log(err)
    })
  }

  exportToExcel() {
    if (this.currentAccounts.length > 0) {
      let currencyAccountTable = document.getElementById('currencyAccountTable')
      let ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(currencyAccountTable)
      let wb: XLSX.WorkBook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Cari Listesi')
      XLSX.writeFile(wb, `${this.currentListText}.xlsx`)
    } else {
      this.toastrService.info('Cari Listesi Boş')
    }
  }


  delete(currencyAccount: any) {
    this.currencyAccountService.delete(currencyAccount.id).subscribe(res => {
      this.toastrService.success('Cari Hesabı Başarıyla Silindi', 'Başarılı')
      this.getCurrencyAccounts()
    }, err => {
      this.toastrService.error(err.error, currencyAccount.name)
    })
  }


  createCurrentAccountAdd() {
    this.addCurrencyAccountForm = new FormGroup({
      companyId: new FormControl(this.companyId),
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      code: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required, Validators.minLength(10)]),
      taxDepartment: new FormControl(''),
      taxIdNumber: new FormControl(''),
      identityNumber: new FormControl(''),
      email: new FormControl(''),
      authorized: new FormControl(''),
      addedAt: new FormControl(new Date())
    })
  }

  createCurrentAccountUpdate() {
    this.currentAccountUpdateForm = new FormGroup({
      id: new FormControl(this.currentAccountId),
      companyId: new FormControl(this.companyId),
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      code: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required, Validators.minLength(10)]),
      taxDepartment: new FormControl(''),
      taxIdNumber: new FormControl(''),
      identityNumber: new FormControl(''),
      email: new FormControl(''),
      authorized: new FormControl(''),
      addedAt: new FormControl(new Date()),
      isActive: new FormControl('')
    })
  }


  // aktif pasif listesi
  activeCheck() {
    this.active == true ? this.passive = false : this.active = false
    this.active == true ? this.currentListText = 'Aktif Cari Listesi' : this.currentListText = 'Cari Listesi'
  }
  passiveCheck() {
    this.passive == true ? this.active = false : this.passive = false
    this.passive == true ? this.currentListText = 'Pasif Cari Listesi' : this.currentListText = 'Cari Listesi'
  }
  activePassiveStatus() {
    return this.active == true ? 'Aktif' : this.passive == true ? 'Pasif' : ''
  }
  // aktif pasif listesi

  // current account add
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
  // current account add

  // current account update
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
  // current account update

  add() {
    this.spinner.show()
    if (this.addCurrencyAccountForm.valid) {
      // console.log('valide girdi')
      let currentAccount: CurrentAccountModel = this.addCurrencyAccountForm.value
      currentAccount.isActive = this.trueFalseStatus()
      //console.log("status:" + this.trueFalseStatus())
      this.currencyAccountService.add(currentAccount).subscribe(res => {
        this.spinner.hide()
        this.toastrService.success('Cari Hesap Başarıyla Eklendi', this.addCurrencyAccountForm.value.name)
        this.getCurrencyAccounts()
        document.getElementById('addCurrencyAccountModal').click()
        this.createCurrentAccountAdd()
      }, err => {
        this.spinner.hide()
        this.toastrService.error(err.error)
      })
    } else {
      // console.log('else e girdi')
      this.spinner.hide()
      this.toastrService.warning('Lütfen gerekli alanları doldurunuz.')
    }
  }

  getById(id: number) {
    this.currencyAccountService.getById(id).subscribe(res => {
      this.currentAccountUpdateForm.setValue({
        id: res.data.id,
        companyId: res.data.companyId,
        name: res.data.name,
        code: res.data.code,
        address: res.data.address,
        taxDepartment: res.data.taxDepartment,
        taxIdNumber: res.data.taxIdNumber,
        identityNumber: res.data.identityNumber,
        email: res.data.email,
        authorized: res.data.authorized,
        addedAt: res.data.addedAt,
        isActive: res.data.isActive
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
    if (this.currentAccountUpdateForm.valid) {
      let currentAccount: CurrentAccountModel = this.currentAccountUpdateForm.value
      currentAccount.isActive = this.trueFalseStatusUpdate()
      this.currencyAccountService.update(currentAccount).subscribe(res => {
        this.spinner.hide()
        this.toastrService.success(res.message, this.currentAccountUpdateForm.value.name)
        this.getCurrencyAccounts()
        document.getElementById('updateCurrencyAccountModal').click()
        this.createCurrentAccountUpdate()
      }, err => {
        this.spinner.hide()
        console.log(err)
      })
    } else {
      console.log('else e girdi')
      this.spinner.hide()
      this.toastrService.warning('Lütfen gerekli alanları doldurunuz.')
    }
  }

  fileChange(event: any) {
    this.file = event.target.files[0]
  }

  addFromExcel() {
    if (this.file == '') return
    if (this.file != null || this.file != undefined || this.file != '') {
      this.spinner.show()
      this.currencyAccountService.addFromExcel(this.file, this.companyId).subscribe(res => {
        this.spinner.hide()
        this.toastrService.success(res.message)
        this.getCurrencyAccounts()
        document.getElementById('addFromExcelCurrencyAccountModal').click()
        this.file = ''
      }, err => {
        this.spinner.hide()
        if (err.error.includes('Invalid file signature.'))
          this.toastrService.warning('Lütfen geçerli bir dosya seçiniz.')
        else if (err.error.includes('The uploaded file exceeds the upload_max_filesize directive in php.ini'))
          this.toastrService.error('Dosya boyutu çok büyük.')
        else if (err.error.includes('Exception'))
          this.toastrService.warning('Dosya boş ya da yanlış bir dosya seçtiniz.')
        else console.log(err)
      })
    } else {
      this.toastrService.warning('Lütfen Excel Dosyası Seçiniz.')
    }
  }

}


// excelden veri çektincen sonra update yaptım ama durum udeğiştirince anında gözükmüyor sayfayı yenilemek gerekiyor