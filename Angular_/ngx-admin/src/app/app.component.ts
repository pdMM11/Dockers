/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import {UserService} from './services/user.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  public user: any;
  constructor(private analytics: AnalyticsService,
              private _userService: UserService) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();

    this.user = {
      username: '',
      password: '',
    };
  }

  login() {
    this._userService.login({'username': this.user.username, 'password': this.user.password});
  }

  refreshToken() {
    this._userService.refreshToken();
  }

  logout() {
    this._userService.logout();
  }
}
