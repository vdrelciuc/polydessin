import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';
import * as CONSTANT from 'src/app/classes/constants';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { PolygonService } from './polygon.service';

describe('PolygonService', () => {
  let service: PolygonService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;
  const eventMocker = (event: string, keyUsed: number, x: number, y: number) =>
      new MouseEvent(event, {button: keyUsed, clientX: x, clientY: y});
  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
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
              createElement: () => mockedRendered,
              setAttribute: () => mockedRendered,
              appendChild: () => mockedRendered,
              removeChild: () => mockedRendered,
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
                clientHeight: 100,
            },
          },
        },
        {
          provide: ColorSelectorService,
          useValue: {
            primaryColor: new BehaviorSubject<Color>(new Color('#FFFFFF')),
            primaryTransparency: new BehaviorSubject<number>(1),
            secondaryColor: new BehaviorSubject<Color>(new Color('#FFFFFF')),
            secondaryTransparency: new BehaviorSubject<number>(1),
          },
        },
        DrawStackService
      ],
    });
    service = getTestBed().get(PolygonService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>);
    service.initialize(manipulator, image,
      getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>),
      getTestBed().get<DrawStackService>(DrawStackService as Type<DrawStackService>));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#constructor should set default properties', () => {
    expect(service['nSides']).toEqual(CONSTANT.DEFAULT_NSIDES);
    expect(service['shapeIsEmpty']).toBe(true);
    expect(service.frenchName).toEqual('Polygone');
    expect(service.shapeStyle.thickness).toEqual(CONSTANT.THICKNESS_DEFAULT);
    expect(service.shapeStyle.hasBorder).toBe(true);
    expect(service.shapeStyle.hasFill).toBe(true);
  });

  it('#initializeProperties should initialize subscriptions', () => {
    const randomTestColor1 = new Color('#123ABC');
    const randomTestColor2 = new Color('#456EFD');
    const randomTestOpacity1 = 2;
    const randomTestOpacity2 = 20;
    service.initializeProperties();
    service['colorSelectorService'].primaryColor.next(randomTestColor1);
    service['colorSelectorService'].secondaryColor.next(randomTestColor1);
    service['colorSelectorService'].primaryTransparency.next(randomTestOpacity1);
    service['colorSelectorService'].secondaryTransparency.next(randomTestOpacity1);
    expect(service.shapeStyle.fillColor).toEqual(randomTestColor1);
    expect(service.shapeStyle.fillOpacity).toEqual(randomTestOpacity1);
    expect(service.shapeStyle.borderColor).toEqual(randomTestColor1);
    expect(service.shapeStyle.borderOpacity).toEqual(randomTestOpacity1);

    service['colorSelectorService'].primaryColor.next(randomTestColor2);
    service['colorSelectorService'].primaryTransparency.next(randomTestOpacity2);
    expect(service.shapeStyle.fillColor).toEqual(randomTestColor2);
    expect(service.shapeStyle.fillOpacity).toEqual(randomTestOpacity2);
    expect(service.shapeStyle.borderColor).toEqual(randomTestColor1);
    expect(service.shapeStyle.borderOpacity).toEqual(randomTestOpacity1);
  });

  it('#onMousePress should stop drawing', () => {
    service.onMousePress(eventMocker('mousemove', 0, 0, 0));
    service.onMousePress(eventMocker('mousemove', 0, 0, 0));
    expect(service['isChanging']).not.toBeTruthy();
  });

  it('#onMousePress should start drawing properly', () => {
    service.onMousePress(eventMocker('mousemove', 0, 0, 0));
    expect(service['isChanging']).toBeTruthy();
  });

  it('#onMouseMove should update mousePosition when drawing', () => {
    service.onMousePress(eventMocker('mousemove', 0, 0, 0));
    const newX = 42;
    const newY = 69;
    service.onMouseMove(eventMocker('mousemove', 0, newX, newY));
    expect(service['mousePointer'].getX()).toBe(newX);
    expect(service['mousePointer'].getY()).toBe(newY);
  });

  it('#onMouseMove should not update mousePosition when not drawing', () => {
    const newX = 42;
    const newY = 69;
    service.onMouseMove(eventMocker('mousemove', 0, newX, newY));
    expect(service['mousePointer']).toBeUndefined();
    expect(service['mousePointer']).toBeUndefined();
  });

  it('drawing works properly in first quadrant', () => {
    const nSides = 3;
    service.nSides = nSides;
    const originX = 50;
    const originY = 50;
    service.onMousePress(eventMocker('XD', 0, originX, originY));
    const mouseX1 = 55;
    const mouseX2 = 150;
    const mouseY = 75;
    const spy = spyOn(manipulator, 'setAttribute');
    service.onMouseMove(eventMocker('XD', 0, mouseX1, mouseY));
    expect(spy).toHaveBeenCalled();
    const spyCount = spy.calls.count();
    service.onMouseMove(eventMocker('XD', 0, mouseX2, mouseY));
    expect(spy.calls.count()).toBeGreaterThan(spyCount);
  });

  it('drawing works properly in third quadrant', () => {
    const nSides = 12;
    service.nSides = nSides;
    const originX = 50;
    const originY = 50;
    service.onMousePress(eventMocker('XD', 0, originX, originY));
    const mouseX1 = 45;
    const mouseX2 = 0;
    const mouseY = 25;
    const spy = spyOn(manipulator, 'setAttribute');
    service.onMouseMove(eventMocker('XD', 0, mouseX1, mouseY));
    expect(spy).toHaveBeenCalled();
    const spyCount = spy.calls.count();
    service.onMouseMove(eventMocker('XD', 0, mouseX2, mouseY));
    expect(spy.calls.count()).toBeGreaterThan(spyCount);
  });

  it('#onMouseRelease should not create shape if not moved', () => {
    const spy = spyOn(service['drawStack'], 'addElementWithInfos');
    service.onMousePress(eventMocker('Hello ', 0, 0, 0));
    service.onMouseRelease(eventMocker('World!', 0, 0, 0));
    expect(spy).not.toHaveBeenCalled();
  });

  it('#onMouseRelease should not create shape if empty', () => {
    const spy = spyOn(service['drawStack'], 'addElementWithInfos');
    service.onMousePress(eventMocker('Hello ', 0, 0, 0));
    const randomMovePosition = 50;
    service.onMouseMove(eventMocker('Hello ', 0, randomMovePosition, randomMovePosition));
    service.onMouseMove(eventMocker('Hello ', 0, 0, 0));
    service.onMouseRelease(eventMocker('World!', 0, 0, 0));
    expect(spy).not.toHaveBeenCalled();
  });

  it('#onMouseRelease should create shape', () => {
    service.onMousePress(eventMocker('Hello ', 0, 0, 0));
    const randomMovePosition = 50;
    service.onMouseMove(eventMocker('it\'s ', 0, randomMovePosition, randomMovePosition));
    const spy = (service['pushElement'] = jasmine.createSpy().and.callFake(() => null));
    const spy2 = (service['perimeter'].remove = jasmine.createSpy().and.callFake(() => null));
    service.onMouseRelease(eventMocker('me!', 0, randomMovePosition, randomMovePosition));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(2);
  });

  it('#onMouseInCanvas should update shape', () => {
    service.onMousePress(eventMocker('Hello ', 0, 0, 0));
    const spy = spyOn(manipulator, 'setAttribute');
    service.onMouseInCanvas(eventMocker('Hello ', 0, 0, 0));
    expect(spy).toHaveBeenCalled();
  });

  it('Changing tool should cancel current shape', () => {
    const spyPushStack = spyOn(service['drawStack'], 'addElementWithInfos');
    const spyRemove = spyOn(manipulator, 'removeChild');
    service.onMousePress(eventMocker('Hello ', 0, 0, 0));
    const randomMovePosition = 50;
    service.onMouseMove(eventMocker('XD ', 0, randomMovePosition, randomMovePosition));
    service.endTool();
    expect(spyPushStack).not.toHaveBeenCalled();
    expect(spyRemove).toHaveBeenCalled();
  });
});
