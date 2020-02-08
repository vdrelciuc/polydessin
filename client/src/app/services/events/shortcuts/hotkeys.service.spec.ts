import { TestBed } from '@angular/core/testing';

import { HotkeysService } from './hotkeys.service';
// import { emit } from 'cluster';

describe('HotkeysService', () => {

  let service: HotkeysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(HotkeysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
