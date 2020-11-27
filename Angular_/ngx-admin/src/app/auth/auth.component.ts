import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {throwError} from 'rxjs';

@Component({
  selector: 'ngx-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  /**
   * An object representing the user for the login form
   */
  public user: any;

  constructor(private _userService: UserService) {
  }

  ngOnInit() {
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
