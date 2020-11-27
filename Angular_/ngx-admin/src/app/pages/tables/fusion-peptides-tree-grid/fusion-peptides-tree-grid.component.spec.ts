import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FusionPeptidesTreeGridComponent } from './fusion-peptides-tree-grid.component';

describe('FusionPeptidesTreeGridComponent', () => {
  let component: FusionPeptidesTreeGridComponent;
  let fixture: ComponentFixture<FusionPeptidesTreeGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FusionPeptidesTreeGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FusionPeptidesTreeGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
