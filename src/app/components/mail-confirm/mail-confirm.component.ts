import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mail-confirm',
  templateUrl: './mail-confirm.component.html',
  styleUrls: ['./mail-confirm.component.css']
})
export class MailConfirmComponent implements OnInit {

  message : string = ''
  alreadyApproved : boolean = false // zaten onaylanmış
  approved : boolean = false // onaylandı


  constructor(private authService : AuthService, private activatedRoute : ActivatedRoute) { }

  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res => {
      this.confirmUser(res['value'])
    })
  }

  confirmUser(value : string) {
    this.authService.confirmUser(value).subscribe((res : any) => {
      this.message = res.message
    }, err => {
       this.message = err.error.message

    })
  }


}
