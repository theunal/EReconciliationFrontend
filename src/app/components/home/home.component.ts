import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserThemeModel } from 'src/app/models/userThemeModel';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  jwtHelper: JwtHelperService = new JwtHelperService()
  userTheme: UserThemeModel

  userId : number

  buttonClass : string = 'fixed-plugin ps'

  constructor(private userService : UserService, private authService : AuthService) { }

  ngOnInit(): void {
    this.refresh()
    this.getUserTheme()
  }

  refresh() {
    if (this.authService.isAuthenticated()) {
      let decode = this.jwtHelper.decodeToken(localStorage.getItem('token'))
      this.userId = decode[Object.keys(decode).filter(x => x.endsWith('/nameidentifier'))[0]]
    }
  }

  changeButton() { // sağ alttaki ayar butonu
    return this.buttonClass
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


}
