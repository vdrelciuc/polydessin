import { TestBed } from '@angular/core/testing';

import { Tools } from 'src/app/enums/tools';
import { ToolSelectorService } from './tool-selector.service';

describe('ToolSelectorService', () => {
  let service: ToolSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ToolSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should have 'Selection' as its default tool", () => {
    const defaultTool = Tools.Selection;
    service.$currentTool.subscribe((tool: string) => {
      expect(tool).toBe(defaultTool);
    });
  });

  it('#setCurrentTool should update curent tool to Aerosol when given Aerosol', () => {
    const newTool = Tools.Aerosol;
    service.setCurrentTool(newTool);
    service.$currentTool.subscribe((tool: string) => {
      expect(tool).toBe(newTool);
    });
  });
});
