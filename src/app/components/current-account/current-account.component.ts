import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CurrentAccountModel } from 'src/app/models/currentAccountModel';
import { AuthService } from 'src/app/services/auth.service';
import { CurrencyAccountService } from 'src/app/services/currency-account.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-current-account',
  templateUrl: './current-account.component.html',
  styleUrls: ['./current-account.component.css']
})
export class CurrentAccountComponent implements OnInit {

  jwtHelper: JwtHelperService = new JwtHelperService()
  currentAccounts: CurrentAccountModel[] = []
  companyId: number
  searchText: string = ''

  currentAccountUpdateForm: FormGroup
  checkboxTrue: boolean = true
  checkboxFalse: boolean = false

  addCurrencyAccountForm: FormGroup

  active: boolean = false
  passive: boolean = false
  currentListText: string = 'Cari Listesi'


  constructor(private currencyAccountService: CurrencyAccountService, private authService: AuthService,
    private spinner: NgxSpinnerService, private toastrService: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.refresh()
    this.getCurrencyAccounts()
    this.createCurrentAccountUpdate()
    this.createCurrentAccountAdd()
  }

  refresh() {
    if (this.authService.isAuthenticated()) {
      let decode = this.jwtHelper.decodeToken(localStorage.getItem('token'))
      this.companyId = decode[Object.keys(decode).filter(x => x.endsWith('/anonymous'))[0]]
    }
  }

  getCurrencyAccounts() {
    this.spinner.show()
    this.currencyAccountService.getCurrencyAccounts(this.companyId).subscribe(res => {
      this.spinner.hide()
      this.currentAccounts = res.data
      console.log(res)
    }, err => {
      this.spinner.hide()
      // this.authService.logout()
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


  createCurrentAccountUpdate() {
    this.currentAccountUpdateForm = new FormGroup({
      currentAccountName: new FormControl(''),
      currentAccountCode: new FormControl(''),
      currentAccountTaxDepartment: new FormControl(''),
      currentAccountTaxIdNumber: new FormControl(''),
      currentAccountEmail: new FormControl(''),
      currentAccountAuthorized: new FormControl('')
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
      addedAt: new FormControl(new Date()),
      isActive: new FormControl(this.trueFalseStatus())
    })
  }



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

  add() {
    this.spinner.show()
    if (this.addCurrencyAccountForm.valid) {
      console.log('valide girdi')
      let currencyAccount: CurrentAccountModel = this.addCurrencyAccountForm.value
      this.currencyAccountService.add(currencyAccount).subscribe(res => {
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
      console.log('else e girdi')
      this.spinner.hide()
      this.toastrService.warning('Lütfen gerekli alanları doldurunuz.')
    }
  }





}
