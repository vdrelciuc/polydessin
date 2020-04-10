// tslint:disable: no-magic-numbers | Reason: arbitrary values used for testing purposes
import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { SVGProperties } from 'src/app/enums/svg-html-properties';
import { ColorSelectorService } from '../../color-selector/color-selector.service';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { FeatherService } from './feather.service';

describe('FeatherService', () => {

  let service: FeatherService;
  // tslint:disable-next-line: no-any | Reason typedef Element of parentElement throws an error
  const mockedRendered = (parentElement: any, name: string, debugInfo?: string): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Renderer2,
          useValue: {
            createElement: () => ({
              cloneNode: () => null
            }),
            setAttribute: () => mockedRendered,
            appendChild: () => mockedRendered,
            removeChild: () => mockedRendered,
          },
        },
        {
          provide: ElementRef,
          useValue: {
            nativeElement: {
              cloneNode: () => null,
              getBoundingClientRect: () => ({
                  left: 100,
                  top: 100,
              }),
            },
          },
        },
        {
          provide: ColorSelectorService,
          useValue: {
            primaryColor: ({
                value: {
                    getHex: () => '#FFFFFF'
                }
            }),
            primaryTransparency: ({
                value: {
                    toString: () => '0.5'
                }
            })
          },
        },
        DrawStackService
      ],
    });
    service = TestBed.get(FeatherService);
    service.initialize(
      getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>),
      getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>),
      getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>),
      getTestBed().get<DrawStackService>(DrawStackService as Type<DrawStackService>)
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#onSelect should init subElement', () => {
    const spy = spyOn(service['manipulator'], 'createElement');
    service.onSelect();
    expect(spy).toHaveBeenCalledWith(SVGProperties.g, SVGProperties.nameSpace);
  });

  it('#endTool should remove preview and unfinished element', () => {
    service['isDrawing'] = true;
    service['preview'] = { remove: () => null} as unknown as SVGLineElement;
    service['subElement'] = { remove: () => null} as unknown as SVGGElement;
    const spy1 = spyOn(service['preview'], 'remove');
    const spy2 = spyOn(service['subElement'], 'remove');
    service.endTool();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(service['isDrawing']).toEqual(false);
  });

  it('#endTool should remove subElement', () => {
    service['preview'] =    undefined as unknown as SVGLineElement;
    service['subElement'] = {remove: () => null} as unknown as SVGGElement;
    service.endTool();
  });

  it('#onMouseOutCanvas should stop drawing and remove previeiw', () => {
    service['previousMouse'] = new CoordinatesXY(10, 10);
    service['isDrawing'] = true;
    service['preview'] = { remove: () => null} as unknown as SVGLineElement;
    const spy = spyOn(service['preview'], 'remove');
    service.onMouseOutCanvas({} as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
    expect(service['isDrawing']).toEqual(false);
  });

  it('#onMouseOutCanvas should stop, but is not drawing', () => {
    service['isDrawing'] = false;
    service['preview'] = undefined as unknown as SVGLineElement;
    const spy = spyOn(service, 'onMouseMove');
    service.onMouseOutCanvas({} as unknown as MouseEvent);
    expect(spy).not.toHaveBeenCalled();
    expect(service['isDrawing']).toEqual(false);
  });

  it('#onMouseInCanvas should create preview', () => {
    const spy = spyOn(service['manipulator'], 'createElement');
    service.onMouseInCanvas({} as unknown as MouseEvent);
    expect(spy).toHaveBeenCalledWith(SVGProperties.line, SVGProperties.nameSpace);
  });

  it('#onMousePress should enable drawing and create subeleemnt', () => {
    service['isDrawing'] = false;
    service['preview'] = {
        cloneNode: () => null,
        remove: () => null
    } as unknown as SVGLineElement;
    const spy = spyOn(service['preview'], 'cloneNode');
    service.onMousePress({button: 0, clientX: 200, clientY: 200} as unknown as MouseEvent);
    expect(spy).toHaveBeenCalled();
    expect(service['previousMouse'].getX()).toEqual(100);
    expect(service['previousMouse'].getY()).toEqual(100);
    service['isDrawing'] = true;
  });

  it('#onMousePress should not enable drawing, not left click', () => {
    service['isDrawing'] = false;
    service.onMousePress({button: 1} as unknown as MouseEvent);
    service['isDrawing'] = false;
  });

  it('#onMouseMove should only update preview', () => {
    service['isDrawing'] = false;
    const spy = spyOn(service['manipulator'], 'setAttribute');
    const spy2 = spyOn(service['manipulator'], 'appendChild');
    service.onMouseMove({clientX: 100, clientY: 100} as unknown as MouseEvent);
    expect(spy).toHaveBeenCalledTimes(6);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  it('#onMouseMove should update preview and draw', () => {
    service['isDrawing'] = true;
    service['previousMouse'] = new CoordinatesXY(10, 10);
    const spy = spyOn(service['manipulator'], 'setAttribute');
    const spy2 = spyOn(service['manipulator'], 'appendChild');
    service.onMouseMove({clientX: 100, clientY: 100} as unknown as MouseEvent);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  it('#onMouseRelease should stop drawing and push drawing', () => {
    service['isDrawing'] = true;
    service['preview'] = {remove: () => null, cloneNode: () => null} as unknown as SVGLineElement;
    service['subElement'] = {childElementCount: 4} as unknown as SVGGElement;
    const spy2 = spyOn(service, 'onSelect');
    const spy3 = spyOn(service, 'addPath');
    service.onMouseRelease({clientX: 100, clientY: 100} as unknown as MouseEvent);
    expect(spy2).toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();
    expect(service['isDrawing']).toEqual(false);
  });

  it('#onMouseWheel should increment by 15', () => {
    service.onMouseWheel({deltaY: -1, altKey: false} as unknown as WheelEvent);
    expect(service.angle).toEqual(15);
  });

  it('#onMouseWheel should decrement by 15', () => {
    service.onMouseWheel({deltaY: 1, altKey: false} as unknown as WheelEvent);
    expect(service.angle).toEqual(345);
  });

  it('#onMouseWheel should increment by 1', () => {
    service.angle = (360);
    service.onMouseWheel({deltaY: -1, altKey: true} as unknown as WheelEvent);
    expect(service.angle).toEqual(1);
  });

  it('#onMouseWheel should decrement by 1', () => {
    service.angle = (360);
    service.onMouseWheel({deltaY: 1, altKey: true} as unknown as WheelEvent);
    expect(service.angle).toEqual(359);
  });
});
