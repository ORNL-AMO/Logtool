import { TestBed } from '@angular/core/testing';

import { RouteIndicatorService } from './route-indicator.service';

describe('RouteIndicatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouteIndicatorService = TestBed.get(RouteIndicatorService);
    expect(service).toBeTruthy();
  });
});
