import { TestBed } from '@angular/core/testing';

import { IndexDataBaseStoreService } from './index-data-base-store.service';

describe('IndexDataBaseStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndexDataBaseStoreService = TestBed.get(IndexDataBaseStoreService);
    expect(service).toBeTruthy();
  });
});
