import { TestBed } from '@angular/core/testing';

import { ExportCSVService } from './export-csv.service';

describe('ExportCSVService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExportCSVService = TestBed.get(ExportCSVService);
    expect(service).toBeTruthy();
  });
});
