import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeptideReferencesComponent } from './peptide-references.component';

describe('PeptideReferencesComponent', () => {
  let component: PeptideReferencesComponent;
  let fixture: ComponentFixture<PeptideReferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeptideReferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeptideReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
