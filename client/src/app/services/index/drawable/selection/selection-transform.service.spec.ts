import { TestBed } from '@angular/core/testing';

import { SelectionTransformService } from './selection-transform.service';

describe('SelectionTransformService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectionTransformService = TestBed.get(SelectionTransformService);
    expect(service).toBeTruthy();
  });
});
