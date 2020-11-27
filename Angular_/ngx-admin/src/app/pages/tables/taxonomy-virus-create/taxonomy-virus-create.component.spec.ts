import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxonomyVirusCreateComponent } from './taxonomy-virus-create.component';

describe('TaxonomyVirusCreateComponent', () => {
  let component: TaxonomyVirusCreateComponent;
  let fixture: ComponentFixture<TaxonomyVirusCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxonomyVirusCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxonomyVirusCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
