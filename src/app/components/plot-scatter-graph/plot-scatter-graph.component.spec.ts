import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotScatterGraphComponent } from './plot-scatter-graph.component';

describe('PlotScatterGraphComponent', () => {
  let component: PlotScatterGraphComponent;
  let fixture: ComponentFixture<PlotScatterGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotScatterGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotScatterGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
