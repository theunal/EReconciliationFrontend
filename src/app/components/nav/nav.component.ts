import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CompanyModel } from 'src/app/models/companyModel';
import { CompanyService } from 'src/app/services/company.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChangeCompanyDto } from './../../models/DTOs/changeCompanyDto';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  
  buttonClass : string = 'fixed-plugin ps'

  jwtHelper: JwtHelperService = new JwtHelperService()

  companyName: string
  userId: number

  companies: CompanyModel[] = []

  constructor(private companyService: CompanyService, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.refresh()
    this.getAllCompanyAdminUserId()
  }

  refresh() {
    let decode = this.jwtHelper.decodeToken(localStorage.getItem('token'))
    this.companyName = decode[Object.keys(decode).filter(x => x.endsWith('ispersistent'))[0]]
    this.userId = decode[Object.keys(decode).filter(x => x.endsWith('/nameidentifier'))[0]]
  }

  changeButton() { // sağ alttaki ayar butonu
    return this.buttonClass
  }


  getAllCompanyAdminUserId() {
    this.companyService.getAllCompanyAdminUserId(this.userId).subscribe(res => {
      this.companies = res.data
    })
  }

  changeCompany(companyId: number, companyName: string) {
    this.spinner.show()
    let dto: ChangeCompanyDto = { userId: this.userId, companyId: companyId }
    this.companyService.changeCompany(dto).subscribe(res => {
      this.spinner.hide()
      localStorage.removeItem('token')
      localStorage.setItem('token', res.data.token)
      this.ngOnInit()
      window.location.reload()
    }, err => {
      this.spinner.hide()
      this.toastr.error(err.error)
    })

  }


}
