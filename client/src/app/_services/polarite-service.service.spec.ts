import { TestBed } from '@angular/core/testing';

import { PolariteServiceService } from './polarite-service.service';

describe('PolariteServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PolariteServiceService = TestBed.get(PolariteServiceService);
    expect(service).toBeTruthy();
  });
});
