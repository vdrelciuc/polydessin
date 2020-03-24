import { TestBed } from '@angular/core/testing';

import { FeatherService } from './feather.service';

describe('FeatherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FeatherService = TestBed.get(FeatherService);
    expect(service).toBeTruthy();
  });
});
