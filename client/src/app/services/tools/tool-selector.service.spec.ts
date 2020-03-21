import { TestBed } from '@angular/core/testing';

import { Tools } from 'src/app/enums/tools';
import { LineService } from '../index/drawable/line/line.service';
import { PencilService } from '../index/drawable/pencil/pencil.service';
import { ToolSelectorService } from './tool-selector.service';
import { PipetteService } from '../pipette.service';
import { ColorApplicatorService } from '../index/drawable/colorApplicator/color-applicator.service';
import { SprayService } from '../index/drawable/spray/spray.service';
import { RectangleService } from '../index/drawable/rectangle/rectangle.service';
import { BrushService } from '../index/drawable/brush/brush.service';
import { PolygonService } from '../index/drawable/polygon/polygon.service';
import { EllipseService } from '../index/drawable/ellipse/ellipse.service';
import { EraserService } from '../index/drawable/eraser/eraser.service';
import { SelectionService } from '../index/drawable/selection/selection.service';
import { GridService } from '../index/drawable/grid/grid.service';
import { Renderer2, ElementRef } from '@angular/core';
import { ColorSelectorService } from '../color-selector.service';
import { DrawStackService } from './draw-stack/draw-stack.service';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';

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

  it('#initialize should initialize elements', () => {
    service.initialize(
      {
        createElement: () => null,
        setAttribute: () => null,
        appendChild: () => null,
      } as unknown as Renderer2, 
      {
        nativeElement:  {
          cloneNode: () => new Array(),
          querySelectorAll: () => [],
        }
      } as unknown as ElementRef<SVGElement>, 
      {
        primaryColor: new BehaviorSubject<Color>(new Color('#FFFFFF')),
        primaryTransparency: new BehaviorSubject<number>(0.5)
      } as unknown as ColorSelectorService, 
      {
        addedSVG: new BehaviorSubject<SVGElement | undefined>(undefined),
        addedToRedo: new BehaviorSubject<SVGElement | undefined>(undefined),
        reset: new BehaviorSubject<boolean>(false),
        newSVG: new BehaviorSubject<boolean>(false),
      } as unknown as DrawStackService, 
      {nativeElement: 5} as unknown as ElementRef<HTMLCanvasElement>
    );
    const tool = new LineService;
    service['tool'] = tool;
    const spy = spyOn(tool, 'endTool');
    service.memory.changed.next(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it('#initialize should initialize elements', () => {
    service.initialize(
      {
        createElement: () => null,
        setAttribute: () => null,
        appendChild: () => null,
        removeChild: () => null,
      } as unknown as Renderer2, 
      {
        nativeElement:  {
          cloneNode: () => new Array(),
          querySelectorAll: () => [],
        }
      } as unknown as ElementRef<SVGElement>, 
      {
        primaryColor: new BehaviorSubject<Color>(new Color('#FFFFFF')),
        primaryTransparency: new BehaviorSubject<number>(0.5)
      } as unknown as ColorSelectorService, 
      {
        addedSVG: new BehaviorSubject<SVGElement | undefined>(undefined),
        addedToRedo: new BehaviorSubject<SVGElement | undefined>(undefined),
        reset: new BehaviorSubject<boolean>(false),
        newSVG: new BehaviorSubject<boolean>(false),
      } as unknown as DrawStackService, 
      {nativeElement: 5} as unknown as ElementRef<HTMLCanvasElement>
    );
    const tool = new LineService;
    service['tool'] = tool;
    const spy = spyOn(tool, 'endTool');
    const spy2 = spyOn(tool, 'onSelect');
    service.memory.changed.next(true);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('#initialize should initialize elements', () => {
    service.initialize(
      {
        createElement: () => null,
        setAttribute: () => null,
        appendChild: () => null,
        removeChild: () => null,
      } as unknown as Renderer2, 
      {
        nativeElement:  {
          cloneNode: () => new Array(),
          querySelectorAll: () => [],
        }
      } as unknown as ElementRef<SVGElement>, 
      {
        primaryColor: new BehaviorSubject<Color>(new Color('#FFFFFF')),
        primaryTransparency: new BehaviorSubject<number>(0.5)
      } as unknown as ColorSelectorService, 
      {
        addedSVG: new BehaviorSubject<SVGElement | undefined>(undefined),
        addedToRedo: new BehaviorSubject<SVGElement | undefined>(undefined),
        reset: new BehaviorSubject<boolean>(false),
        newSVG: new BehaviorSubject<boolean>(false),
      } as unknown as DrawStackService, 
      {nativeElement: 5} as unknown as ElementRef<HTMLCanvasElement>
    );
    const tool = new LineService;
    service['tool'] = undefined;
    const spy = spyOn(tool, 'endTool');
    const spy2 = spyOn(tool, 'onSelect');
    service.memory.changed.next(true);
    expect(spy).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('#getCurrentTool should return default current tool', () => {
    expect(service.getCurrentTool()).toEqual(service.getSelection());
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

  it('#getBrush should get brush', () => {
    expect(service.getBrush()).toEqual(new BrushService());
  });

  it('#getPipette should get pippette', () => {
    expect(service.getPipette()).toEqual(new PipetteService());
  });

  it('#getPolygon should get polygone', () => {
    expect(service.getPolygon()).toEqual(new PolygonService());
  });

  it('#getEllipse should get ellipse', () => {
    expect(service.getEllipse()).toEqual(new EllipseService());
  });

  it('#getEraser should get eraser', () => {
    expect(service.getEraser()).toEqual(new EraserService());
  });

  it('#getSelection should get selection', () => {
    expect(service.getSelection()).toEqual(new SelectionService());
  });

  it('#getColorApplicator should get color applicator', () => {
    expect(service.getColorApplicator()).toEqual(new ColorApplicatorService());
  });

  it('#getSpray should get spray', () => {
    expect(service.getSpray()).toEqual(new SprayService());
  });

  it('#getGrid should get grid', () => {
    expect(service.getGrid()).toEqual(new GridService());
  });

  // Add other should get here, brush, rectangle...

  it('#setCurrentTool should set new current tool (available)', () => {
    service.setCurrentTool(Tools.Line);
    expect(service.getCurrentTool()).toEqual(new LineService());
  });

  it('#setCurrentTool should set new current tool (not available)', () => {
    service.setCurrentTool('Bla' as Tools);
    expect(service.getCurrentTool()).toEqual(service.getSelection());
  });

  it('#setCurrentTool should set none with old being undefined', () => {
    service['tool'] = undefined;
    service.setCurrentTool(Tools.None);
    expect(service.$currentTool.value).toEqual(Tools.None);
  });

  it('#setCurrentTool should set none with old being undefined', () => {
    service['tool'] = service.getLine();
    const spy = spyOn(service['tool'], 'endTool');
    service.setCurrentTool(Tools.None);
    expect(spy).toHaveBeenCalled();
    expect(service.getCurrentTool()).toEqual(service.getSelection());
  });

  it('#getTool should find Line tool in map', () => {
    expect(service.getTool(Tools.Line)).toEqual(new LineService());
  });

  it('#getTool shouldn\'t find non existant tool in map', () => {
    expect(service.getTool('Bla' as Tools)).toEqual(undefined);
  });
});
