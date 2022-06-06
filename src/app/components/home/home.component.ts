import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  buttonClass : string = 'fixed-plugin ps'
  constructor() { }

  ngOnInit(): void {
  }

  changeButton() { // sağ alttaki ayar butonu
    return this.buttonClass
  }
}
