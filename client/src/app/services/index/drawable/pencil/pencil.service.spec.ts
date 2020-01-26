import { TestBed } from '@angular/core/testing';

import { PencilService } from './pencil.service';

describe('PenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PencilService = TestBed.get(PencilService);
    expect(service).toBeTruthy();
  });
});
