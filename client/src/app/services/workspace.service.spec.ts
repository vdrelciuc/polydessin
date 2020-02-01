 import { TestBed } from '@angular/core/testing';

import { WorkspaceService } from './workspace.service';

describe('WorkspaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkspaceService = TestBed.get(WorkspaceService);
    expect(service).toBeTruthy();
  });

  it('should set new color', () => {
    const service: WorkspaceService = TestBed.get(WorkspaceService);
    service.setBackgroundColorHex('898989');
    expect(service.checkIfSameBackgroundColor('898989')).toBe(true);
  });

  it('should be same color', () => {
    const service: WorkspaceService = TestBed.get(WorkspaceService);
    expect(service.checkIfSameBackgroundColor('808080')).toBe(true);
  });


  it('should not be same color/ valid color', () => {
    const service: WorkspaceService = TestBed.get(WorkspaceService);
    expect(service.checkIfSameBackgroundColor('809980')).toBe(false);
  });

  it('should not be same color/ not valid color', () => {
    const service: WorkspaceService = TestBed.get(WorkspaceService);
    expect(service.checkIfSameBackgroundColor('i am here')).toBe(false);
  });

  it('should not be same color/ undefined color', () => {
    const service: WorkspaceService = TestBed.get(WorkspaceService);
    expect(service.checkIfSameBackgroundColor(undefined as unknown as string)).toBe(false);
  });

  it('should assign color', () => {
    const service: WorkspaceService = TestBed.get(WorkspaceService);
    service.setBackgroundColorHex('898989');
    expect(service.checkIfSameBackgroundColor('898989')).toBe(true);
  });

  it('should not assign color (not valid)', () => {
    const service: WorkspaceService = TestBed.get(WorkspaceService);
    service.setBackgroundColorHex('i am here');
    expect(service.checkIfSameBackgroundColor('808080')).toBe(true);
  });

  it('should not assign undefined color', () => {
    const service: WorkspaceService = TestBed.get(WorkspaceService);
    service.setBackgroundColorHex(undefined as unknown as string);
    expect(service.checkIfSameBackgroundColor('808080')).toBe(true);
  });
});
