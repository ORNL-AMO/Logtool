import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolderDayTypeComponent } from './holder-day-type.component';

describe('HolderDayTypeComponent', () => {
  let component: HolderDayTypeComponent;
  let fixture: ComponentFixture<HolderDayTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolderDayTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolderDayTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
