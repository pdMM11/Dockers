import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProteinListComponent } from './protein-list.component';

describe('ProteinListComponent', () => {
  let component: ProteinListComponent;
  let fixture: ComponentFixture<ProteinListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProteinListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProteinListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
