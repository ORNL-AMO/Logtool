import { TestBed } from '@angular/core/testing';

import { GraphCalculationService } from './graph-calculation.service';

describe('GraphCalculationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphCalculationService = TestBed.get(GraphCalculationService);
    expect(service).toBeTruthy();
  });
});
