import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MlPredictComponent } from './ml-predict.component';

describe('MlPredictComponent', () => {
  let component: MlPredictComponent;
  let fixture: ComponentFixture<MlPredictComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MlPredictComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MlPredictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
