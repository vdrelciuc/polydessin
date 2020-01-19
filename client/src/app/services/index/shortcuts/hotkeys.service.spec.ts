import { TestBed } from '@angular/core/testing';

import { HotkeysService } from './hotkeys.service';

describe('HotkeysService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HotkeysService = TestBed.get(HotkeysService);
    expect(service).toBeTruthy();
  });
});
