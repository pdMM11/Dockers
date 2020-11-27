import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProteinListTreeGridComponent } from './protein-list-tree-grid.component';

describe('ProteinListTreeGridComponent', () => {
  let component: ProteinListTreeGridComponent;
  let fixture: ComponentFixture<ProteinListTreeGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProteinListTreeGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProteinListTreeGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
