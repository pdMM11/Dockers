import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FusionPeptideListComponent } from './fusion-peptide-list.component';

describe('FusionPeptideListComponent', () => {
  let component: FusionPeptideListComponent;
  let fixture: ComponentFixture<FusionPeptideListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FusionPeptideListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FusionPeptideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
