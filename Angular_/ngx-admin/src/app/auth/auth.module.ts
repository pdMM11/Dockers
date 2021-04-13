import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// import { NgxAuthRoutingModule } from './auth-routing.module';
import {NbAuthModule, NbAuthStrategyClass, NbPasswordAuthStrategyOptions} from '@nebular/auth';
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
} from '@nebular/theme';
import {LoginComponent} from './admin-pages/login/login.component';
import {RegisterComponent} from './admin-pages/register/register.component';
import {LogoutComponent} from './admin-pages/logout/logout.component';
import {RequestPasswordComponent} from './admin-pages/request-password/request-password.component';
import {ResetPasswordComponent} from './admin-pages/reset-password/reset-password.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    // NgxAuthRoutingModule,

    NbAuthModule,
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    RequestPasswordComponent,
    ResetPasswordComponent,
  ],
})
export class NgxAuthModule {
  static forRoot(param: { strategies: [NbAuthStrategyClass, NbPasswordAuthStrategyOptions][];
  forms: { requestPassword: any; resetPassword: any; logout: { redirectDelay: number }; login: any; register: any } }) {
    return undefined;
  }
}
