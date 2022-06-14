import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AccountReconciliationModel } from 'src/app/models/accountReconciliationModel';
import { AccountReconciliationDto } from 'src/app/models/DTOs/accountReconciliationDto';
import { UserOperationClaimModel } from 'src/app/models/userOperationClaimModel';
import { UserThemeModel } from 'src/app/models/userThemeModel';
import { AuthService } from 'src/app/services/auth.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { CurrentAccountService } from 'src/app/services/current-account.service';
import { UserOperationClaimService } from 'src/app/services/user-operation-claim.service';
import { UserService } from 'src/app/services/user.service';
import * as XLSX from 'xlsx';
import { AccountReconciliationService } from './../../services/account-reconciliation.service';
import { CurrencyModel } from './../../models/currencyModel';
import { CurrentAccountModel } from 'src/app/models/currentAccountModel';

@Component({
  selector: 'app-account-reconciliation',
  templateUrl: './account-reconciliation.component.html',
  styleUrls: ['./account-reconciliation.component.css']
})
export class AccountReconciliationComponent implements OnInit {

  jwtHelper: JwtHelperService = new JwtHelperService()
  accountReconciliations: AccountReconciliationDto[] = []
  accountReconciliation: AccountReconciliationModel
  userOperationClaims: UserOperationClaimModel[] = []
  userTheme: UserThemeModel

  companyId: number
  userId: number
  searchText: string = ''

  accountReconciliationUpdateForm: FormGroup
  checkboxUpdateTrue: boolean = false
  checkboxUpdateFalse: boolean = false
  currentAccountId: number

  addAccountReconciliationForm: FormGroup
  checkboxTrue: boolean = true
  checkboxFalse: boolean = false

  active: boolean = false
  passive: boolean = false
  wait: boolean = false
  currentListText: string = 'Cari Mutabakat Listesi'

  file: string = ''

  accountReconciliationGetall: boolean = false
  accountReconciliationGet: boolean = false
  accountReconciliationAdd: boolean = false
  accountReconciliationUpdate: boolean = false
  accountReconciliationDelete: boolean = false

  accountReconciliationCount: number = 0
  accountReconciliationApproved: number = 0
  accountReconciliationNotApproved: number = 0
  accountReconciliationPendingApproval: number = 0

  allCurrencies: CurrencyModel[]
  allCurrentAccounts: CurrentAccountModel[]
  currencyId: number
  currentAccountIdforAdd: number

  constructor(private accountReconciliationService: AccountReconciliationService, private authService: AuthService,
    private spinner: NgxSpinnerService, private toastrService: ToastrService,
    private userOperationClaimService: UserOperationClaimService, private userService: UserService,
    private currencyService: CurrencyService, private currentAccountService: CurrentAccountService) { }

  ngOnInit(): void {
    this.refresh()
    this.getUserOperationClaims()
    this.getAccountReconciliations()
    this.getUserTheme()
    // add  
    this.getAllCurrencies()
    this.getCurrencyAccounts()
    // add  
    this.createAccountReconciliationAdd()
  }

  refresh() {
    if (this.authService.isAuthenticated()) {
      let decode = this.jwtHelper.decodeToken(localStorage.getItem('token'))
      this.companyId = decode[Object.keys(decode).filter(x => x.endsWith('/anonymous'))[0]]
      this.userId = decode[Object.keys(decode).filter(x => x.endsWith('/nameidentifier'))[0]]
    }
  }

  getUserTheme() {
    this.spinner.show()
    this.userService.getUserTheme(this.userId).subscribe(res => {
      this.spinner.hide()
      this.userTheme = res.data
    }, err => {
      this.spinner.hide()
      console.log(err)
    })
  }

  sidebarModeClass() {
    return 'sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-' +
      this.userTheme?.sidebarMode
  }

  getAccountReconciliations() {
    this.spinner.show()
    this.accountReconciliationService.getAllDto(this.companyId).subscribe(res => {
      res.data.forEach(element => {
        console.log(element.id)
      })

      this.spinner.hide()
      this.accountReconciliations = res.data
      this.accountReconciliationCount = res.data.length
      this.accountReconciliationApproved = res.data.filter(x => x.isResultSucceed).length
      this.accountReconciliationNotApproved = res.data.filter(x => x.isResultSucceed == false).length
      this.accountReconciliationPendingApproval = res.data.filter(x => x.isResultSucceed == null).length
      // burda kaldım onaylanan mutabakatlar
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

      if (res.data.find(x => x.operationClaimName == 'accountReconciliation.getall')) this.accountReconciliationGetall = true
      if (res.data.find(x => x.operationClaimName == 'accountReconciliation.get')) this.accountReconciliationGet = true
      if (res.data.find(x => x.operationClaimName == 'accountReconciliation.add')) this.accountReconciliationAdd = true
      if (res.data.find(x => x.operationClaimName == 'accountReconciliation.update')) this.accountReconciliationUpdate = true
      if (res.data.find(x => x.operationClaimName == 'accountReconciliation.delete')) this.accountReconciliationDelete = true

      if (res.data.find(x => x.operationClaimName == 'admin')) {
        this.accountReconciliationGetall = true
        this.accountReconciliationGet = true
        this.accountReconciliationAdd = true
        this.accountReconciliationUpdate = true
        this.accountReconciliationDelete = true
      }
    }, err => {
      this.spinner.hide()
      console.log(err)
    })
  }

  exportToExcel() {
    if (this.accountReconciliations.length > 0) {
      let currencyAccountTable = document.getElementById('currencyAccountTable')
      let ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(currencyAccountTable)
      let wb: XLSX.WorkBook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Cari Listesi')
      XLSX.writeFile(wb, `${this.currentListText}.xlsx`)
    } else {
      this.toastrService.info('Cari Listesi Boş')
    }
  }


  delete(id: number) {
    this.spinner.show()
    this.accountReconciliationService.delete(id).subscribe(res => {
      this.spinner.hide()
      this.toastrService.info(res.message, 'Başarılı')
      this.getAccountReconciliations()
    }, err => {
      this.spinner.hide()
      this.toastrService.error(err.error, this.accountReconciliation.guid)
    })
  }

  getAllCurrencies() {
    this.currencyService.getAllCurrencies().subscribe(res => {
      this.allCurrencies = res.data
    }, err => {
      console.log(err)
    })
  }
  getCurrencyAccounts() {
    this.currentAccountService.getCurrencyAccounts(this.companyId).subscribe(res => {
      this.allCurrentAccounts = res.data
    }, err => {
      console.log(err)
    })
  }

  createAccountReconciliationAdd() {
    this.addAccountReconciliationForm = new FormGroup({
      companyId: new FormControl(this.companyId),
      currencyId: new FormControl(''),    // required
      currentAccountId: new FormControl(''),      // required

      startingDate: new FormControl(''),
      endingDate: new FormControl(''),

      currencyDebit: new FormControl('', [Validators.required]),
      currencyCredit: new FormControl('', [Validators.required]),

      isSendEmail: new FormControl(false),
      sendEmailDate: new FormControl(new Date().toISOString()),

      isEmailRead: new FormControl(false),
      emailReadDate: new FormControl(new Date().toISOString()),

      isResultSucceed: new FormControl(null),
      resultDate: new FormControl(new Date().toISOString()),

      // resultNote: new FormControl(''),
      // guid: new FormControl('')
    })
  }

  add() {
    this.spinner.show()
    if (this.addAccountReconciliationForm.value.startingDate > this.addAccountReconciliationForm.value.endingDate) {
      this.toastrService.error('Lütfen tarihleri doğru giriniz.', 'Hata')
      return
    }
    if (this.addAccountReconciliationForm.valid) {
      this.accountReconciliationService.add(this.addAccountReconciliationForm.value).subscribe(res => {
        this.spinner.hide()
        this.getAccountReconciliations()
        this.createAccountReconciliationAdd()
        document.getElementById('addCurrentAccountModal').click()
        this.toastrService.success(res.message, 'Başarılı')
      }, err => {
        this.spinner.hide()
        console.log(err)
      })
    } else {
      this.spinner.hide()
      this.toastrService.warning('Lütfen gerekli yerleri dolrudurunu<.')
    }
  }












  // onaylanmış onaylanmamış bekleniyor listesi
  activeCheck() {
    this.active == true ? this.passive = false : this.active = false
    if (this.active) {
      this.passive = false
      this.wait = false
    } else {
    }
    this.active == true ? this.currentListText = 'Onaylanmış Cari Mutabakat Listesi' : this.currentListText = 'Cari Mutabakat Listesi'
  }
  passiveCheck() {
    this.passive == true ? this.active = false : this.passive = false
    if (this.passive) {
      this.active = false
      this.wait = false
    } else {
    }
    this.passive == true ? this.currentListText = 'Onaylanmamış Cari Mutabakat Listesi' : this.currentListText = 'Cari Mutabakat Listesi'
  }
  waitCheck() {
    console.log(this.wait)
    if (this.wait) {
      this.active = false
      this.passive = false
    } else {
    }
    this.wait == true ? this.currentListText = 'Durumu Beklenen Cari Mutabakat Listesi' : this.currentListText = 'Cari Mutabakat Listesi'
  }
  activePassiveStatus() {
    return this.active == true ? 'Onaylandı' : this.passive == true ? 'Onaylanmadı' : this.wait == true ? 'Bekleniyor' : ''
  }
  // onaylanmış onaylanmamış bekleniyor listesi

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


  // update() {
  //   this.spinner.show()
  //   if (this.currentAccountUpdateForm.valid) {
  //     let currentAccount: AccountReconciliationModel = this.currentAccountUpdateForm.value
  //     // currentAccount.isActive = this.trueFalseStatusUpdate()
  //     this.accountReconciliationService.update(currentAccount).subscribe(res => {
  //       this.spinner.hide()
  //       this.toastrService.success(res.message, this.currentAccountUpdateForm.value.name)
  //       this.getAccountReconciliations()
  //       document.getElementById('updateCurrencyAccountModal').click()
  //       this.createCurrentAccountUpdate()
  //     }, err => {
  //       this.spinner.hide()
  //       console.log(err)
  //     })
  //   } else {
  //     console.log('else e girdi')
  //     this.spinner.hide()
  //     this.toastrService.warning('Lütfen gerekli alanları doldurunuz.')
  //   }
  // }

  fileChange(event: any) {
    this.file = event.target.files[0]
  }

  addFromExcel() {
    this.spinner.show()
    if (this.file == '') return
    if (this.file != null || this.file != undefined || this.file != '') {
      this.accountReconciliationService.addByExcel(this.file, this.companyId).subscribe(res => {
        this.spinner.hide()
        this.toastrService.success(res.message)
        this.getAccountReconciliations()
        document.getElementById('addAccountReconciliationByExcelModal').click()
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
      this.spinner.hide()
      this.toastrService.warning('Lütfen Excel Dosyası Seçiniz.')
    }
  }




}


