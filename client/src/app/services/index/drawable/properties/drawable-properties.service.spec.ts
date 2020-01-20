import { TestBed } from '@angular/core/testing';

import { DrawablePropertiesService } from './drawable-properties.service';

describe('DrawablePropertiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawablePropertiesService = TestBed.get(DrawablePropertiesService);
    expect(service).toBeTruthy();
  });
});
