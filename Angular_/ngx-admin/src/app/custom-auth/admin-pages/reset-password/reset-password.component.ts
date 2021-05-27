import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {NB_AUTH_OPTIONS, NbResetPasswordComponent} from '@nebular/auth';
import {NbAuthService} from '@nebular/auth';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'ngx-login',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent extends NbResetPasswordComponent {
  // token = JSON.parse(localStorage.getItem('auth_app_token'))['value'];

  token: any;
  protected service: NbAuthService;
  protected options: {};
  protected cd: ChangeDetectorRef;
  protected router: Router;
  redirectDelay: number;
  showMessages: any;
  strategy: string;
  submitted: boolean;
  errors: string[];
  messages: string[];
  user: any;
  constructor(service: NbAuthService,
              @Inject(NB_AUTH_OPTIONS) options: {},
              cd: ChangeDetectorRef,
              router: Router,
              private cookieService: CookieService) {
    super(service, options, cd, router);
    this.token = this.cookieService.get('crsftoken');
    // alert(this.token);
  }

}

