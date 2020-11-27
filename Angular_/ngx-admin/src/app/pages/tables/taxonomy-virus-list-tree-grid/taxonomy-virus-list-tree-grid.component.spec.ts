import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxonomyVirusListTreeGridComponent } from './taxonomy-virus-list-tree-grid.component';

describe('TaxonomyVirusListTreeGridComponent', () => {
  let component: TaxonomyVirusListTreeGridComponent;
  let fixture: ComponentFixture<TaxonomyVirusListTreeGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxonomyVirusListTreeGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxonomyVirusListTreeGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
