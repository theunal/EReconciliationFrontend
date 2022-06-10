import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MailConfirmComponent } from './components/mail-confirm/mail-confirm.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { NavComponent } from './components/nav/nav.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { CurrentAccountPipe } from './pipes/current-account.pipe';
import { CurrentAccountActivePasivePipe } from './pipes/current-account-active-pasive.pipe';
import { CurrentAccountComponent } from './components/current-account/current-account.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    MailConfirmComponent,
    PasswordResetComponent,
    NavComponent,
    SidenavComponent,
    CurrentAccountPipe,
    CurrentAccountActivePasivePipe,
    CurrentAccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SweetAlert2Module.forRoot(), 
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      progressBar: true,
      progressAnimation: 'increasing',
      timeOut: 3000
    })
  ],
  providers: [
    {provide: 'api', useValue: 'https://localhost:7154/api/'},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
