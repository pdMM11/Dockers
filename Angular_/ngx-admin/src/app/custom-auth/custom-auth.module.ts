import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// import { NgxAuthRoutingModule } from './auth-routing.module';
import {NbAuthModule, NbAuthStrategyClass, NbPasswordAuthStrategyOptions} from '@nebular/auth';
import {
  NbIconModule,
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule, NbCardModule,
} from '@nebular/theme';
import {LoginComponent} from './admin-pages/login/login.component';
import {RegisterComponent} from './admin-pages/register/register.component';
import {LogoutComponent} from './admin-pages/logout/logout.component';
import {RequestPasswordComponent} from './admin-pages/request-password/request-password.component';
import {ResetPasswordComponent} from './admin-pages/reset-password/reset-password.component';
import {CustomAuthComponent} from './custom-auth.component';
import {AuthBlockComponent} from './admin-pages/auth-block/auth-block.component';
import {CustomAuthRoutingModule} from './custom-auth-routing.module';
import {MiscellaneousModule} from '../pages/miscellaneous/miscellaneous.module';


@NgModule({
  imports: [
    CustomAuthRoutingModule,
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    // NgxAuthRoutingModule,

    NbAuthModule,

    NbIconModule,

    NbCardModule,

    MiscellaneousModule,
  ],
  declarations: [

    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    RequestPasswordComponent,
    ResetPasswordComponent,

    // NotFoundComponent,
  ],
})
export class CustomAuthModule { }
