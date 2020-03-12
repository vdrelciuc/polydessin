import { TestBed } from '@angular/core/testing';

import { SelectionTransformShortcutService } from './selection-transform-shortcut.service';

describe('SelectionTransformShortcutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectionTransformShortcutService = TestBed.get(SelectionTransformShortcutService);
    expect(service).toBeTruthy();
  });
});
