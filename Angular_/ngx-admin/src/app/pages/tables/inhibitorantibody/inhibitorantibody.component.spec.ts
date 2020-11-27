import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InhibitorantibodyComponent } from './inhibitorantibody.component';

describe('InhibitorantibodyComponent', () => {
  let component: InhibitorantibodyComponent;
  let fixture: ComponentFixture<InhibitorantibodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InhibitorantibodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InhibitorantibodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
