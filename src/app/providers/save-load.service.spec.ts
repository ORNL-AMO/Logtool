import { TestBed } from '@angular/core/testing';

import { SaveLoadService } from './save-load.service';

describe('SaveLoadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaveLoadService = TestBed.get(SaveLoadService);
    expect(service).toBeTruthy();
  });
});
