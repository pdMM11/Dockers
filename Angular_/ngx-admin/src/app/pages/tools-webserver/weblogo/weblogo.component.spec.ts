import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeblogoComponent } from './weblogo.component';

describe('WeblogoComponent', () => {
  let component: WeblogoComponent;
  let fixture: ComponentFixture<WeblogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeblogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeblogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
