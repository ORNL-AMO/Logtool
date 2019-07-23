import { TestBed } from '@angular/core/testing';

import { GraphCreationService } from './graph-creation.service';

describe('GraphCreationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphCreationService = TestBed.get(GraphCreationService);
    expect(service).toBeTruthy();
  });
});
