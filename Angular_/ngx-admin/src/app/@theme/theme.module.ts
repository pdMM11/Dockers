import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  NbInputModule, // add this line
  NbAlertModule, // add this line
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbThemeModule,
  NbPopoverModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbSecurityModule } from '@nebular/security';

import {
  FooterComponent,
  HeaderComponent,
  SearchInputComponent,
  TinyMCEComponent,
} from './components';
import {
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
} from './pipes';
import {
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
} from './layouts';
import { DEFAULT_THEME } from './styles/theme.default';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { CORPORATE_THEME } from './styles/theme.corporate';
import { DARK_THEME } from './styles/theme.dark';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
/**
import {
  LoginComponent,
  LogoutComponent,
  RegisterComponent,
  RequestPasswordComponent,
  ResetPasswordComponent,
} from './components/auth/components';

import {LoginComponent} from './components/auth/components/login/login.component';
import {LogoutComponent} from './components/auth/components/logout/logout.component';
import {RegisterComponent} from './components/auth/components/register/register.component';
import {RequestPasswordComponent} from './components/auth/components/request-password/request-password.component';
import {ResetPasswordComponent} from './components/auth/components/reset-password/reset-password.component';
import {AuthBlockComponent} from './components/auth/components/auth-block/auth-block.component';

import {LoginComponent} from '../custom-auth/admin-pages/login/login.component';
import {RegisterComponent} from '../custom-auth/admin-pages/register/register.component';
import {LogoutComponent} from '../custom-auth/admin-pages/logout/logout.component';
import {RequestPasswordComponent} from '../custom-auth/admin-pages/request-password/request-password.component';
import {ResetPasswordComponent} from '../custom-auth/admin-pages/reset-password/reset-password.component';
*/

const NB_MODULES = [
  NbInputModule, // add this line
  NbAlertModule, // add this line
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbEvaIconsModule,
  NbPopoverModule,
];
const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  SearchInputComponent,
  TinyMCEComponent,
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,

/**
  AuthBlockComponent,
  LoginComponent,
  RegisterComponent,
  LogoutComponent,
  RequestPasswordComponent,
  ResetPasswordComponent,
*/

];
const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
];

@NgModule({
  imports: [CommonModule, ...NB_MODULES, ReactiveFormsModule, MatAutocompleteModule, RouterModule],
  exports: [CommonModule, ...PIPES, ...COMPONENTS],
  declarations: [...COMPONENTS, ...PIPES],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'default',
          },
          [ DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME ],
        ).providers,
      ],
    };
  }
}
