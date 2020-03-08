import { TestBed } from '@angular/core/testing';

import { SprayService } from './spray.service';

describe('SprayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SprayService = TestBed.get(SprayService);
    expect(service).toBeTruthy();
  });
});
