import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProteinReferencesComponent } from './protein-references.component';

describe('ProteinReferencesComponent', () => {
  let component: ProteinReferencesComponent;
  let fixture: ComponentFixture<ProteinReferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProteinReferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProteinReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
