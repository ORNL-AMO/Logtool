import { TestBed } from '@angular/core/testing';

import { IndexFileStoreService } from './index-file-store.service';

describe('IndexFileStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndexFileStoreService = TestBed.get(IndexFileStoreService);
    expect(service).toBeTruthy();
  });
});
