import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthBlockComponent } from './auth-block.component';

describe('AuthBlockComponent', () => {
  let component: AuthBlockComponent;
  let fixture: ComponentFixture<AuthBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
