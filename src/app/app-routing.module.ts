import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentAccountComponent } from './components/current-account/current-account.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MailConfirmComponent } from './components/mail-confirm/mail-confirm.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { RegisterComponent } from './components/register/register.component';
import { UserOperationClaimComponent } from './components/user-operation-claim/user-operation-claim.component';
import { UserComponent } from './components/user/user.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: '', component: HomeComponent/*, canActivate: [AuthGuard]*/},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'mailConfirm/:value', component: MailConfirmComponent},
  {path: 'passwordReset/:value', component: PasswordResetComponent},
  {path: 'forgotPasswordLinkCheck/:value', component: PasswordResetComponent},
  {path: 'currentAccount', component: CurrentAccountComponent},
  {path: 'user', component: UserComponent},
  {path: 'userOperationClaim/:value', component: UserOperationClaimComponent},


  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
