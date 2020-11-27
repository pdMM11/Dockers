import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxHostComponent } from './tax-host.component';

describe('TaxHostComponent', () => {
  let component: TaxHostComponent;
  let fixture: ComponentFixture<TaxHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
