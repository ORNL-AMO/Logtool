import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistogramBinTypeComponent } from './histogram-bin-type.component';

describe('HistogramBinTypeComponent', () => {
  let component: HistogramBinTypeComponent;
  let fixture: ComponentFixture<HistogramBinTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistogramBinTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistogramBinTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
