import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphTextAnnotationComponent } from './graph-text-annotation.component';

describe('GraphTextAnnotationComponent', () => {
  let component: GraphTextAnnotationComponent;
  let fixture: ComponentFixture<GraphTextAnnotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphTextAnnotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphTextAnnotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
