import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HmmerComponent } from './hmmer.component';

describe('HmmerComponent', () => {
  let component: HmmerComponent;
  let fixture: ComponentFixture<HmmerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HmmerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
