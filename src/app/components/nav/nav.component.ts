import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  jwtHelper: JwtHelperService = new JwtHelperService()
  companyName: string

  constructor() { }

  ngOnInit(): void {
    let decode = this.jwtHelper.decodeToken(localStorage.getItem('token'))
    this.companyName = decode[Object.keys(decode).filter(x => x.endsWith('ispersistent'))[0]]
  }

}
