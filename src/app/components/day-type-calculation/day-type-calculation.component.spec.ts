import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTypeCalculationComponent } from './day-type-calculation.component';

describe('DayTypeCalculationComponent', () => {
  let component: DayTypeCalculationComponent;
  let fixture: ComponentFixture<DayTypeCalculationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayTypeCalculationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayTypeCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
