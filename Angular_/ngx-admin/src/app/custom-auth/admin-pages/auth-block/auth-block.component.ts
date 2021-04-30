import { Component, OnInit } from '@angular/core';
import {NbAuthBlockComponent} from '@nebular/auth';

@Component({
  selector: 'ngx-auth-block',
  styleUrls: ['./auth-block.component.scss'],
  template: `
    <ng-content></ng-content>
  `,
})
export class AuthBlockComponent extends NbAuthBlockComponent {
}
