import { TestBed } from '@angular/core/testing';

import { ColorApplicatorService } from './color-applicator.service';

describe('ColorApplicatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColorApplicatorService = TestBed.get(ColorApplicatorService);
    expect(service).toBeTruthy();
  });
});
