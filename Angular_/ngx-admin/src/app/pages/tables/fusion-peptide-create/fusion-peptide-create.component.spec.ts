import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FusionPeptideCreateComponent } from './fusion-peptide-create.component';

describe('FusionPeptideCreateComponent', () => {
  let component: FusionPeptideCreateComponent;
  let fixture: ComponentFixture<FusionPeptideCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FusionPeptideCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FusionPeptideCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
