import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxonomyVirusListComponent } from './taxonomy-virus-list.component';

describe('TaxonomyVirusListComponent', () => {
  let component: TaxonomyVirusListComponent;
  let fixture: ComponentFixture<TaxonomyVirusListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxonomyVirusListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxonomyVirusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
