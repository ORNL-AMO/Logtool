import { TestBed } from '@angular/core/testing';

import { RouteDataTransferService } from './route-data-transfer.service';

describe('RouteDataTransferService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouteDataTransferService = TestBed.get(RouteDataTransferService);
    expect(service).toBeTruthy();
  });
});
