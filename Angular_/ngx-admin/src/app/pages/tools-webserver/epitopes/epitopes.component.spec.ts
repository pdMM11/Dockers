import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpitopesComponent } from './epitopes.component';

describe('EpitopesComponent', () => {
  let component: EpitopesComponent;
  let fixture: ComponentFixture<EpitopesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpitopesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpitopesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
