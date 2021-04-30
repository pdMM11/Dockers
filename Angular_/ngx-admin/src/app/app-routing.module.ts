import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import {AuthGuard} from './services/auth-guard.service';

/**
import {LoginComponent} from './custom-admin/login/login.component';
import {LogoutComponent} from './custom-admin/logout/logout.component';
 import {RegisterComponent} from './custom-admin/register/register.component';
 import {RequestPasswordComponent} from './custom-admin/request-password/request-password.component';
import {ResetPasswordComponent} from './custom-admin/reset-password/reset-password.component';



 import { LoginComponent } from './@theme/components/auth/components/login/login.component';
 import {LogoutComponent} from './@theme/components/auth/components/logout/logout.component';
 import {RegisterComponent} from './@theme/components/auth/components/register/register.component';
 import {RequestPasswordComponent} from './@theme/components/auth/components/request-password/request-password.component';
 import {ResetPasswordComponent} from './@theme/components/auth/components/reset-password/reset-password.component';
*/

const routes: Routes = [
  {
    path: 'pages',
    // canActivate: [AuthGuard], // here we tell Angular to check the access with our AuthGuard
    loadChildren: () => import('app/pages/pages.module')
      .then(m => m.PagesModule),
  },
  /**
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NbLoginComponent,
      },
      {
        path: 'login',
        component: NbLoginComponent,
      },
      {
        path: 'register',
        component: NbRegisterComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      },
    ],
  },
   */
  {
    path: 'auth',
    loadChildren: './custom-auth/custom-auth.module#CustomAuthModule',
    // loadChildren: () => import('app/pages/pages.module').then(m => m.PagesModule),

  },
  {path: '', redirectTo: 'pages', pathMatch: 'full'},
  // {path: '**', redirectTo: 'pages'},
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
