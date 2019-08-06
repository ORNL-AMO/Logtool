import { TestBed } from '@angular/core/testing';

import { DayTypeSaveLoadService } from './day-type-save-load.service';

describe('DayTypeSaveLoadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DayTypeSaveLoadService = TestBed.get(DayTypeSaveLoadService);
    expect(service).toBeTruthy();
  });
});
