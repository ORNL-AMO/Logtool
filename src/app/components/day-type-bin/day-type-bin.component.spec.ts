import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTypeBinComponent } from './day-type-bin.component';

describe('DayTypeBinComponent', () => {
  let component: DayTypeBinComponent;
  let fixture: ComponentFixture<DayTypeBinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayTypeBinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayTypeBinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
