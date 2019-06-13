import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotLineGraphComponent } from './plot-line-graph.component';

describe('PlotLineGraphComponent', () => {
  let component: PlotLineGraphComponent;
  let fixture: ComponentFixture<PlotLineGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotLineGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotLineGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
