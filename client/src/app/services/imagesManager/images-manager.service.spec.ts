import { TestBed } from '@angular/core/testing';

import { ImagesManagerService } from './images-manager.service';

describe('ImagesManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImagesManagerService = TestBed.get(ImagesManagerService);
    expect(service).toBeTruthy();
  });
});
