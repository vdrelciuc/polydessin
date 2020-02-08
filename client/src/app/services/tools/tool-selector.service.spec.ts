import { TestBed } from '@angular/core/testing';
import { Tools } from 'src/app/enums/tools';
import { BrushService } from '../index/drawable/brush/brush.service';
import { LineService } from '../index/drawable/line/line.service';
import { PencilService } from '../index/drawable/pencil/pencil.service';
import { RectangleService } from '../index/drawable/rectangle/rectangle.service';
import { ToolSelectorService } from './tool-selector.service';

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

  it('#getCurrentTool should return default current tool', () => {
    expect(service.getCurrentTool()).toEqual(undefined);
    // To change when selection tool is available
  });

  it('#getLine should get line', () => {
    expect(service.getLine()).toEqual(new LineService());
  });

  it('#getPencil should get pencil', () => {
    expect(service.getPencil()).toEqual(new PencilService());
  });

  it('#getRectangle should get rectangle', () => {
    expect(service.getRectangle()).toEqual(new RectangleService());
  });

  it('#getBrush should get rectangle', () => {
    expect(service.getBrush()).toEqual(new BrushService());
  });

  // Add other should get here, brush, rectangle...

  it('#setCurrentTool should set new current tool (available)', () => {
    service.setCurrentTool(Tools.Line);
    expect(service.getCurrentTool()).toEqual(new LineService());
  });

  it('#setCurrentTool should set new current tool (not available)', () => {
    service.setCurrentTool(Tools.None);
    expect(service.getCurrentTool()).toEqual(undefined);
  });

  it('#getTool should find Line tool in map', () => {
    expect(service.getTool(Tools.Line)).toEqual(new LineService());
  });

  it('#getTool shouldn\'t find non existant tool in map', () => {
    expect(service.getTool(Tools.Aerosol)).toEqual(undefined);
  });
});
