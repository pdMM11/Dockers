import { Component } from '@angular/core';
import { NbRegisterComponent } from '@nebular/auth';

import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthSocialLink } from '@nebular/auth/auth.options';
import { NbAuthService } from '@nebular/auth/services/auth.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './register.component.html',
})
export class RegisterComponent extends NbRegisterComponent {

  passNonNumeric(pass: string ) {
    const reg = new RegExp(/^\d+$/);
    return reg.test(pass);
      // return isNaN(pass);
  }

}
