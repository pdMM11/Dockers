import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './admin-pages/login/login.component';
import {RegisterComponent} from './admin-pages/register/register.component';
import {LogoutComponent} from './admin-pages/logout/logout.component';
import {RequestPasswordComponent} from './admin-pages/request-password/request-password.component';
import {ResetPasswordComponent} from './admin-pages/reset-password/reset-password.component';
import {NbAuthComponent} from '@nebular/auth';

export const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
      {
        path: 'request-password',
        component: RequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {
}
