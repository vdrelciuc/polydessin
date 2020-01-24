import { TestBed } from '@angular/core/testing';

import { HotkeysService } from './hotkeys.service';

describe('HotkeysService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HotkeysService = TestBed.get(HotkeysService);
    expect(service).toBeTruthy();
  });

  it('should be created', () => {
    const service: HotkeysService = TestBed.get(HotkeysService);
    expect(service).toBeTruthy();
  });

  it('should create shortcut', () => {
    const service: HotkeysService = TestBed.get(HotkeysService);
    service.addShortcut({ keys: 'shift.j', description: 'Function description' });
    expect(service.defaults.description).toBe('Function description');
  });

  it('should change shortcut', () => {
    const service: HotkeysService = TestBed.get(HotkeysService);
    service.addShortcut({ keys: 'shift.j', description: 'Function description' });
    service.addShortcut({ keys: 'shift.j', description: 'Function Changed' });
    expect(service.defaults.description).toBe('Function Changed');
  });
});
