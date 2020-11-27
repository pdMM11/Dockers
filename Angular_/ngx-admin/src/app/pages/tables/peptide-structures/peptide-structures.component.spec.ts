import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeptideStructuresComponent } from './peptide-structures.component';

describe('PeptideStructuresComponent', () => {
  let component: PeptideStructuresComponent;
  let fixture: ComponentFixture<PeptideStructuresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeptideStructuresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeptideStructuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
