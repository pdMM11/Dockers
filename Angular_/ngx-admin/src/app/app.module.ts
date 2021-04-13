/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {CoreModule} from './@core/core.module';
import {ThemeModule} from './@theme/theme.module';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {NbPasswordAuthStrategy, NbAuthModule, NbAuthJWTToken} from '@nebular/auth';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
  NbSelectModule,
} from '@nebular/theme';
// import { AuthGuard } from './services/auth-guard.service';
// import {AuthComponent} from './auth/auth.component';
import {CookieService} from 'ngx-cookie-service';
import { EnvServiceProvider } from './services/env.service.provider';
/**
import {LoginComponent} from './pages/admin-pages/login/login.component';
import {RegisterComponent} from './pages/admin-pages/register/register.component';
import {LogoutComponent} from './pages/admin-pages/logout/logout.component';
import {RequestPasswordComponent} from './pages/admin-pages/request-password/request-password.component';
import {ResetPasswordComponent} from './pages/admin-pages/reset-password/reset-password.component';
*/
import {RegisterComponent} from './pages/admin-pages/register/register.component';
import {NgxAuthModule} from './auth/auth.module';

const formSetting: any = {
  redirectDelay: 0,
  showMessages: {
    success: true,
  },
};


@NgModule({
  declarations: [AppComponent,
    /**
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    RequestPasswordComponent,
    ResetPasswordComponent,
     */

    // RegisterComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbSelectModule,
    ThemeModule.forRoot(),

    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),

    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
          token: {
            class: NbAuthJWTToken,
            key: 'token',
          },
          baseEndpoint: 'http://localhost:8000',
          login: {
            endpoint: '/%5Erest-auth/login/',
            // endpoint: 'api-token-auth/',
            method: 'post',
            redirect: {
              success: '/pages/dashboard',
              failure: null, // stay on the same page
            },
          },
          register: {
            endpoint: '/%5Erest-auth/registration/',
            method: 'post',
            redirect: {
              success: '/pages/dashboard',
              failure: null, // stay on the same page
            },
          },
          logout: {
            endpoint: '/%5Erest-auth/logout/',
            method: 'post',
          },
          requestPass: {
            endpoint: '/%5Erest-auth/password/change/', // verify this one
            method: 'post',
          },
          resetPass: {
            endpoint: '/%5Erest-auth/password/reset/',
            method: 'post',
          },
        }),
      ],
      forms: {
        login: formSetting,
        register: formSetting,
        requestPassword: formSetting,
        resetPassword: formSetting,
        logout: {
          redirectDelay: 0,
        },
      },
    }),
  ],
  bootstrap: [AppComponent],
  providers: [CookieService, EnvServiceProvider],
})
export class AppModule {
}
