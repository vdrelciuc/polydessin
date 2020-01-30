import { TestBed } from '@angular/core/testing';

import { ColorManipService } from './colorManip.service';

describe('ColorManipService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColorManipService = TestBed.get(ColorManipService);
    expect(service).toBeTruthy();
  });
});
