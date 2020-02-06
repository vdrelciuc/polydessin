import { TestBed } from '@angular/core/testing';

import { ColorSelectorService } from './color-selector.service';

describe('ColorSelectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColorSelectorService = TestBed.get(ColorSelectorService);
    expect(service).toBeTruthy();
  });
});
