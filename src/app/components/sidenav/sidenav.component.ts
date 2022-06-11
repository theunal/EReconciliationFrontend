import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/services/auth.service';
import { UserOperationClaimService } from 'src/app/services/user-operation-claim.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  jwtHelper: JwtHelperService = new JwtHelperService()
  name: string
  companyName: string
  companyId: number
  userId: number
  currentUrl: string

  currentAccountMenu: boolean = false
  userMenu: boolean = false
  companyMenu: boolean = false
  mailParameterMenu: boolean = false
  mailTemplateMenu: boolean = false
  accountReconciliationMenu: boolean = false
  babsReconciliationMenu: boolean = false

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute,
    private userOperationClaimService: UserOperationClaimService) { }

  ngOnInit(): void {
    this.refresh()
    this.currentUrl = this.activatedRoute.snapshot.routeConfig.path
    this.getUserOperationClaims()
  }

  refresh() {
    if (this.authService.isAuthenticated()) {
      let token = localStorage.getItem('token')
      let decode = this.jwtHelper.decodeToken(token)
      this.name = decode['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
      this.name = decode[Object.keys(decode).filter(x => x.endsWith('/name'))[0]] // iki türlü de yapılabilir
      this.companyId = decode[Object.keys(decode).filter(x => x.endsWith('/anonymous'))[0]]
      this.userId = decode[Object.keys(decode).filter(x => x.endsWith('/nameidentifier'))[0]]
      // anonymous >> şirket id
      // ispersistent >> şirket adı
    }
  }


  logout() {
    localStorage.removeItem('token')
    this.authService.isAuthenticated()
    this.router.navigate(['/login'])
  }


  sidenavButtonClass(url: string) {
    if (this.currentUrl == url) {
      return 'nav-link text-white active bg-gradient-danger'
    }
    return 'nav-link text-white'
  }

  getUserOperationClaims() {

    this.userOperationClaimService.getAllDto(this.userId, this.companyId).subscribe(res => {
      console.log(res)
      if (res.data.find(x => x.operationClaimName == 'currentAccountMenu'))
        this.currentAccountMenu = true
      if (res.data.find(x => x.operationClaimName == 'userMenu'))
        this.userMenu = true
      if (res.data.find(x => x.operationClaimName == 'companyMenu'))
        this.companyMenu = true
      if (res.data.find(x => x.operationClaimName == 'mailParameterMenu'))
        this.mailParameterMenu = true
      if (res.data.find(x => x.operationClaimName == 'mailTemplateMenu'))
        this.mailTemplateMenu = true
      if (res.data.find(x => x.operationClaimName == 'accountReconciliationMenu'))
        this.accountReconciliationMenu = true
      if (res.data.find(x => x.operationClaimName == 'babsReconciliationMenu'))
        this.babsReconciliationMenu = true
      if (res.data.find(x => x.operationClaimName == 'admin')) {
        this.currentAccountMenu = true
        this.userMenu = true
        this.companyMenu = true
        this.mailParameterMenu = true
        this.mailTemplateMenu = true
        this.accountReconciliationMenu = true
        this.babsReconciliationMenu = true
      } 
      console.log(this.currentAccountMenu)
    }, err => {
      console.log(err)
    })
  }


}
