import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/services/auth.service';
import { CurrencyAccountService } from 'src/app/services/currency-account.service';
import { CurrencyAccountModel } from './../../models/currencyAccountModel';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX  from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-currency-account',
  templateUrl: './currency-account.component.html',
  styleUrls: ['./currency-account.component.css']
})
export class CurrencyAccountComponent implements OnInit {

  jwtHelper : JwtHelperService = new JwtHelperService()
  currencyAccounts : CurrencyAccountModel[] = []
  companyId : number
  searchText : string = ''

  constructor(private currencyAccountService : CurrencyAccountService, private authService : AuthService, 
    private spinner : NgxSpinnerService, private toastrService : ToastrService, private router : Router) { }

  ngOnInit(): void {
    this.refresh()
    this.getCurrencyAccounts()
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
      this.currencyAccounts = res.data
      console.log(res)
    }, err => {
      this.spinner.hide()
      this.authService.logout()
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




}
