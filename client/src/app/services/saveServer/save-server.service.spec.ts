import { TestBed } from '@angular/core/testing';

import { SaveServerService } from './save-server.service';

describe('SaveServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaveServerService = TestBed.get(SaveServerService);
    expect(service).toBeTruthy();
  });
});
