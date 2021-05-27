import {Component, Inject, OnInit} from '@angular/core';
import {NB_AUTH_OPTIONS, NbLogoutComponent, NbTokenService} from '@nebular/auth';
import {NbAuthService} from '@nebular/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'ngx-login',
  templateUrl: './logout.component.html',
})
export class LogoutComponent extends NbLogoutComponent implements OnInit {

  constructor(
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected router: Router,
    protected tokenService: NbTokenService,
  ) {
    super(service, options, router);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  logout(strategy: string): void {
    super.logout(strategy);
    this.tokenService.clear();
  }

  /**
  private TokenService: NbTokenService;

  constructor(service: NbAuthService, @Inject(NB_AUTH_OPTIONS) options: {}, router: Router,
              TokenService: NbTokenService) {
    super(service, options, router);
    this.logout_token();
  }

  logout_token() {
    this.TokenService.clear();
  }
   */
}
