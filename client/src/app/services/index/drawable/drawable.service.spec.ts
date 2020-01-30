import { TestBed } from '@angular/core/testing';

import { DrawableService } from './drawable.service';

describe('DrawableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawableService = TestBed.get(DrawableService);
    expect(service).toBeTruthy();
  });
});
