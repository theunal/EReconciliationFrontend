import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { UserOperationClaimUpdateDto } from 'src/app/models/DTOs/userOperationClaimUpdateDto';
import { OperationClaimModel } from 'src/app/models/operationClaimModel';
import { UserOperationClaimModel } from 'src/app/models/userOperationClaimModel';
import { AuthService } from 'src/app/services/auth.service';
import { OperationClaimService } from 'src/app/services/operation-claim.service';
import { UserOperationClaimService } from 'src/app/services/user-operation-claim.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-operation-claim',
  templateUrl: './user-operation-claim.component.html',
  styleUrls: ['./user-operation-claim.component.css']
})
export class UserOperationClaimComponent implements OnInit {

  jwtHelper: JwtHelperService = new JwtHelperService()
  allOperationClaims: OperationClaimModel[] = []
  userOperationClaims: UserOperationClaimModel[] = []

  searchText: string = ''
  currentListText: string = 'Kullanıcı Yetkileri'
  userGetAll: boolean = true

  companyId: number
  userId: number
  operationClaimId: number
  userValue: string = ''

  claimCheckResult: boolean = false

  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService,
    private userService: UserService, private userOperationClaimService: UserOperationClaimService,
    private operationClaimService: OperationClaimService, private toastr : ToastrService) { }

  ngOnInit(): void {
    this.refresh()
    this.getAllOperationClaims()
    this.activatedRoute.params.subscribe(res => {
      this.userValue = res['value']
    })
    this.getUserIdByValue()
  }

  refresh() {
    if (this.authService.isAuthenticated()) {
      let decode = this.jwtHelper.decodeToken(localStorage.getItem('token'))
      this.companyId = decode[Object.keys(decode).filter(x => x.endsWith('/anonymous'))[0]]
    }
  }

  getAllOperationClaims() {
    this.operationClaimService.getAll().subscribe(res => {
      this.allOperationClaims = res.data
    })
  }

  getUserIdByValue() {
    this.userService.getUserIdByValue(this.userValue).subscribe(res => {
      this.userId = res
      this.getUserOperationClaims()
    })
  }

  getUserOperationClaims() {
    this.userOperationClaimService.getAllDto(this.userId, this.companyId).subscribe(res => {
      this.userOperationClaims = res.data
     // console.log(res.data)
    })
  }

  claimCheck(claimName: string)  {
    let claims = this.userOperationClaims.filter(x => x.operationClaimName === claimName && x.isActive)
    return claims.length > 0 ? true : false
  }


  statusChange(operationClaimId : number) {
    console.log(operationClaimId)

    let dto: UserOperationClaimUpdateDto = {
      userId: this.userId,
      companyId: this.companyId,
      operationClaimId: operationClaimId
    }

      this.userOperationClaimService.userOperationClaimUpdate(dto).subscribe(res => {
        this.toastr.success('Yetki durumu başarıyla güncellendi')
        this.getUserOperationClaims()
      })
  }



}
