import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  jwtHelper: JwtHelperService = new JwtHelperService()
  name : string
  companyName : string
  currentUrl : string

  constructor(private authService: AuthService, private router : Router, private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {
    this.refresh()
    this.currentUrl = this.activatedRoute.snapshot.routeConfig.path
  }

  refresh() {
    if (this.authService.isAuthenticated()) {
      let token = localStorage.getItem('token')
      let decode = this.jwtHelper.decodeToken(token)
      this.name = decode['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
      this.name = decode[Object.keys(decode).filter(x => x.endsWith('/name'))[0]] // iki türlü de yapılabilir
      // anonymous >> şirket id
      // ispersistent >> şirket adı
    }
  }


  logout() {
    localStorage.removeItem('token')
    this.authService.isAuthenticated()
    this.router.navigate(['/login'])
  }


  sidenavButtonClass(url : string) {
    if (this.currentUrl == url) {
      return 'nav-link text-white active bg-gradient-danger'
    }
    return 'nav-link text-white'
  }




}
