import { TestBed } from '@angular/core/testing';

import { DatabaseOperationService } from './database-operation.service';

describe('DatabaseOperationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatabaseOperationService = TestBed.get(DatabaseOperationService);
    expect(service).toBeTruthy();
  });
});
