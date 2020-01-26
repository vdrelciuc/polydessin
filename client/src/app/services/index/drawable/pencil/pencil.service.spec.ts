import { TestBed } from '@angular/core/testing';

import { PenService } from './pencil.service';

describe('PenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PenService = TestBed.get(PenService);
    expect(service).toBeTruthy();
  });
});
