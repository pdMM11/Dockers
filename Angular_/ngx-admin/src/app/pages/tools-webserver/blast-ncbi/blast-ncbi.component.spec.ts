import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlastNcbiComponent } from './blast-ncbi.component';

describe('BlastNcbiComponent', () => {
  let component: BlastNcbiComponent;
  let fixture: ComponentFixture<BlastNcbiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlastNcbiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlastNcbiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
