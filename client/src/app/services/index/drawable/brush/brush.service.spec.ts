import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { BrushService } from './brush.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
// tslint:disable: no-magic-numbers no-any

describe('BrushService', () => {
  let service: BrushService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;
  const colorSubject =  new BehaviorSubject<Color>(new Color('#FFFFFF'));
  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  }
  const eventMocker = (event: string, keyUsed: number) =>
      new MouseEvent(event, {button: keyUsed, clientX: 10, clientY: 10});

  let spyPushSVG: jasmine.Spy<InferableFunction>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Renderer2,
          useValue: {
              createElement: () => mockedRendered,
              setAttribute: () => null,
              appendChild: () => null,
              removeChild: () => null,
          },
      },
      {
        provide: ElementRef,
        useValue: {
            nativeElement: {
                getBoundingClientRect: () => {
                    const boundleft = 0;
                    const boundtop = 0;
                    const boundRect = {
                        left: boundleft,
                        top: boundtop,
                    };
                    return boundRect;
                },
            },
          },
        },
        {
          provide: ColorSelectorService,
          useValue: {
            primaryColor: colorSubject,
            primaryTransparency: new BehaviorSubject<number>(3)
          },
        },
        DrawStackService
      ],
    });
    service = getTestBed().get(BrushService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>)
    service.attributes = new DrawablePropertiesService();
    service.initialize(manipulator, image,
        getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>),
        getTestBed().get<DrawStackService>(DrawStackService as Type<DrawStackService>));

    spyPushSVG = (service['pushElement'] = jasmine.createSpy().and.callFake(() => null));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#initializeProperties should set default properties', () => {
    service.initializeProperties();
    expect(service.thickness).toEqual(service.attributes.thickness.value);
  });

  it('#initializeProperties should initialize subscriptions', () => {
    const randomTestValue = 10;
    service.initializeProperties();
    service.attributes.thickness.next(randomTestValue);
    expect(service.thickness).toEqual(randomTestValue);
  });

  it('#onMouseInCanvas should set preview and create circle', () => {
    const spy = spyOn(manipulator, 'appendChild');
    const spy2 = spyOn(manipulator, 'createElement');
    service.onMouseInCanvas(eventMocker('mousemove', 0));
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('#onMouseInCanvas should set preview', () => {
    service.onMouseInCanvas(eventMocker('mousemove', 0));
    const spy = spyOn(manipulator, 'appendChild');
    service.onMouseInCanvas(eventMocker('mousemove', 0));
    expect(spy).toHaveBeenCalled();
    expect(service['mousePointer']).toBeTruthy();
  });

  it('#onMouseOutCanvas should remove mousepointer preview', () => {
    service.onMouseMove(eventMocker('mousemove', 0));
    const spy = spyOn(manipulator, 'removeChild');
    service.onMouseOutCanvas(eventMocker('mousemove', 0));
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseOutCanvas should push SVG', () => {
    service.onMousePress(eventMocker('mousemove', 0));
    service.onMouseOutCanvas(eventMocker('mousemove', 0));
    expect(service['isDrawing']).not.toBeTruthy();
    expect(spyPushSVG).toHaveBeenCalled();
  });

  it('#onMouseOutCanvas should remove mousePointer', () => {
    service.onMouseMove(eventMocker('mousemove', 0));
    service.onMouseOutCanvas(eventMocker('mousemove', 0));
    expect(service['isDrawing']).not.toBeTruthy();
    expect(service['mousePointer'])
  });

  it('#onMousePress should init elements', () => {
    const spy = spyOn(manipulator, 'createElement');
    const spy2 = spyOn(manipulator, 'setAttribute');
    service.onMousePress(eventMocker('mousemove', 0));
    expect(service['previousX']).toEqual(10);
    expect(service['previousY']).toEqual(10);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledTimes(10);
  });

  it('#onMouseRelease should do nothing', () => {
    const spy = spyOn(service as any, 'updateCursor');
    service['isDrawing'] = false;
    service.onMouseRelease(eventMocker('mouseup', 0));
    expect(service['isDrawing']).not.toBeTruthy();
    expect(spy).not.toHaveBeenCalled();
    expect(spyPushSVG).not.toHaveBeenCalled();
  });

  it('#onMouseRelease should push drawing', () => {
    service.onMousePress(eventMocker('mouseup', 0));
    service.onMouseRelease(eventMocker('mouseup', 0));
    expect(service['isDrawing']).not.toBeTruthy();
    expect(spyPushSVG).toHaveBeenCalled();
  });

  it('#onMouseRelease should update Cursor', () => {
    const spy = spyOn(service as any, 'updateCursor');
    service['isDrawing'] = true;
    service.onMouseRelease(eventMocker('mouseup', 0));
    expect(service['isDrawing']).not.toBeTruthy();
    expect(spy).toHaveBeenCalledWith(10, 10);
  });

  it('#onMouseMove should update cursor', () => {
    const spy = spyOn(service as any, 'updateCursor');
    service['isDrawing'] = false;
    service.onMouseMove(eventMocker('mouseup', 0));
    expect(spy).toHaveBeenCalledWith(10, 10);
  });

  it('#onMouseMove should update cursor', () => {
    service['isDrawing'] = true;
    service.onMouseMove(eventMocker('mouseup', 0));
    expect(service['previousX']).toEqual(10);
    expect(service['previousY']).toEqual(10);
  });

  it('#onClick should stop drawing', () => {
    service.onClick(eventMocker('click', 0));
    expect(service['isDrawing']).not.toBeTruthy();
  });

  it('#endTool should remove everything', () => {
    const mockedRemoveChild = (el: SVGGElement): void => { /*Much Wow*/ };
    service.onMousePress(eventMocker('mousemouve', 0));
    const removeChild = (service['subElement'].remove = jasmine.createSpy().and.callFake(mockedRemoveChild));
    let removeCount = removeChild.calls.count();
    service.onMouseMove(eventMocker('mousemouve', 0));
    expect(service['subElement']).not.toBeUndefined();
    expect(service['mousePointer']).toBeUndefined();
    expect(removeChild.calls.count()).toEqual(removeCount);
    removeCount = removeChild.calls.count();

    service['endTool']();
    expect(service['subElement']).toBeUndefined();
    expect(service['mousePointer']).toBeUndefined();
    expect(removeChild.calls.count()).toBeGreaterThan(removeCount);
    removeCount = removeChild.calls.count();

    service.onMouseMove(eventMocker('mousemouve', 0));
    expect(service['subElement']).toBeUndefined();
    expect(service['mousePointer']).not.toBeUndefined();
    expect(removeChild.calls.count()).toEqual(removeCount);
    removeCount = removeChild.calls.count();

    service['endTool']();
    expect(service['subElement']).toBeUndefined();
    expect(service['mousePointer']).toBeUndefined();
    expect(removeChild.calls.count()).toBeGreaterThan(removeCount);
  });
});
