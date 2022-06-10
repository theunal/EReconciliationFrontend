import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CurrentAccountModel } from 'src/app/models/currentAccountModel';
import { AuthService } from 'src/app/services/auth.service';
import { CurrencyAccountService } from 'src/app/services/currency-account.service';
import * as XLSX  from 'xlsx';

@Component({
  selector: 'app-current-account',
  templateUrl: './current-account.component.html',
  styleUrls: ['./current-account.component.css']
})
export class CurrentAccountComponent implements OnInit {
  jwtHelper : JwtHelperService = new JwtHelperService()
  currentAccounts : CurrentAccountModel[] = []
  companyId : number
  searchText : string = ''

  currentAccountUpdateForm : FormGroup
  checkboxTrue : boolean = false
  checkboxFalse : boolean = false

  all : boolean = false
  active : boolean = false
  passive : boolean = false
  currentListText : string = 'Cari Listesi'

  constructor(private currencyAccountService : CurrencyAccountService, private authService : AuthService, 
    private spinner : NgxSpinnerService, private toastrService : ToastrService, private router : Router) { }

  ngOnInit(): void {
    this.refresh()
    this.getCurrencyAccounts()
    this.createCurrentAccountUpdate()
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
    let currencyAccountTable = document.getElementById('currencyAccountTable') 
    let ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(currencyAccountTable)
    let wb: XLSX.WorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Cari Listesi')
    XLSX.writeFile(wb, 'Cari Listesi.xlsx')
  }


  delete(currencyAccount : any) {
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



  activeCheck() {
    this.active == true ? this.passive = false : this.active = false
    this.active == true ?  this.currentListText = 'Aktif Cari Listesi' : this.currentListText = 'Cari Listesi'
   
  }

  passiveCheck() {
    this.passive == true ? this.active = false : this.passive = false
    this.passive == true ?  this.currentListText = 'Pasif Cari Listesi' : this.currentListText = 'Cari Listesi'
  }

}
