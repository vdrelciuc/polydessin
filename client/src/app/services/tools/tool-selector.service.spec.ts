import { TestBed } from '@angular/core/testing';

import { ToolSelectorService } from './tool-selector.service';
import { LineService } from '../index/drawable/line/line.service';
import { PencilService } from '../index/drawable/pencil/pencil.service';
import { Tools } from 'src/app/enums/tools';

describe('ToolSelectorService', () => {

  let service: ToolSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({

    });
    service = TestBed.get(ToolSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return default current tool', () => {
    expect(service.getCurrentTool()).toEqual(undefined);
    // To change when selection tool is available
  });

  it('should get line', () => {
    expect(service.getLine()).toEqual(new LineService());
  });

  it('should get pencil', () => {
    expect(service.getPencil()).toEqual(new PencilService());
  });

  // Add other should get here, brush, rectangle...

  it('should set new current tool (available)', () => {
    service.setCurrentTool(Tools.Line);
    expect(service.getCurrentTool()).toEqual(new LineService());
  });

  it('should set new current tool (not available)', () => {
    service.setCurrentTool(Tools.None);
    expect(service.getCurrentTool()).toEqual(undefined);
  });

  it('should find Line tool in map', () => {
    expect(service.getTool(Tools.Line)).toEqual(new LineService());
  });

  it('shouldn\'t find non existant tool in map', () => {
    expect(service.getTool(Tools.Aerosol)).toEqual(undefined);
  });

  it('should get french name of some tools', () => {
    const mapOfTools: Map<Tools, string> = new Map();
    mapOfTools.set(Tools.Line, 'Ligne');
    mapOfTools.set(Tools.Brush, 'Pinceau');
    mapOfTools.set(Tools.Rectangle, 'Rectangle');
    mapOfTools.set(Tools.Pencil, 'Crayon');
    let isOk = true;
    for(const element of mapOfTools) {
      service.setCurrentTool(element[0]);
      if(service.getFrenchToolNameToPrint() !== element[1]) {
        isOk = false;
        break;
      }
    }
    expect(isOk).toBe(true);
  });
});
