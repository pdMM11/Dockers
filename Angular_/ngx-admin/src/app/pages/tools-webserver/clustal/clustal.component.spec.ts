import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClustalComponent } from './clustal.component';

describe('ClustalComponent', () => {
  let component: ClustalComponent;
  let fixture: ComponentFixture<ClustalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClustalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClustalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
