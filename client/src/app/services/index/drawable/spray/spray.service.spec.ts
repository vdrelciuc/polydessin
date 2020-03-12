import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { SprayService } from './spray.service';

describe('SprayService', () => {
  let service: SprayService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGGElement>;
  const colorSubject =  new BehaviorSubject<Color>(new Color('#FFFFFF'));
  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  };
  const eventMocker = (event: string, keyUsed: number, x: number, y: number) =>
      new MouseEvent(event, {button: keyUsed, clientX: x, clientY: y});

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
            primaryTransparency: new BehaviorSubject<number>(0)
          },
        },
        DrawStackService
      ],
    });
    service = getTestBed().get(SprayService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>);
    service.initialize(manipulator, image,
      getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>),
      getTestBed().get<DrawStackService>(DrawStackService as Type<DrawStackService>));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('constructor should set default properties', () => {
    expect(service['spraying']).toBeTruthy();
    expect(service['frenchName']).toEqual('Aérosol');
    expect(service['isDrawing']).not.toBeTruthy();
  });

  it('#initializeProperties should initialize subscription to color', () => {
    const randomTestValueColor = new Color('#ABCDEF');
    const randomTestValueOpacity = 21;
    service.initializeProperties();
    service.colorSelectorService.primaryColor.next(randomTestValueColor);
    service.colorSelectorService.primaryTransparency.next(randomTestValueOpacity);
    expect(service['color']).toEqual(randomTestValueColor);
    expect(service['opacity']).toEqual(randomTestValueOpacity);
  });

  it('#onMouseOutCanvas should stop drawing', () => {
    service['isDrawing'].next(true);
    service.onMouseOutCanvas(eventMocker('mousemove', 0, 0, 0));
    expect(service['isDrawing'].value).not.toBeTruthy();
  });

  it('#onMouseRelease should stop drawing', () => {
    service['isDrawing'].next(true);
    service.onMouseRelease(eventMocker('mousemove', 0, 0, 0));
    expect(service['isDrawing'].value).not.toBeTruthy();
  });

  it('#onMouseOutCanvas should add new element to drawStack', () => {
    service.onMousePress(eventMocker('mousepress', 0, 0, 0));
    const spy = spyOn(service['drawStack'], 'addElementWithInfos');
    service.onMouseOutCanvas(eventMocker('mousemove', 0, 0, 0));
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseOutCanvas should not add new element to drawStack', () => {
    service.onMouseRelease(eventMocker('mousepress', 0, 0, 0));
    const spy = spyOn(service['drawStack'], 'addElementWithInfos');
    service.onMouseOutCanvas(eventMocker('mousemove', 0, 0, 0));
    expect(spy).not.toHaveBeenCalled();
  });

  it('#generateRandom should generate random nuber between 0 and 1', () => {
    const random1 = service['generateRandom']();
    const random2 = service['generateRandom']();
    expect(random1).not.toEqual(random2);
    expect(random1).toBeGreaterThanOrEqual(0);
    expect(random2).toBeGreaterThanOrEqual(0);
    expect(random1).toBeLessThanOrEqual(1);
    expect(random2).toBeLessThanOrEqual(1);
  });

  it('#onMouseMove should update mousePosition', () => {
    const newX = 42;
    const newY = 69;
    service.onMouseMove(eventMocker('mousemove', 0, newX, newY));
    expect(service['mousePosition'].getX()).toEqual(newX);
    expect(service['mousePosition'].getY()).toEqual(newY);
  });

  it('#onMousePress should start new drawing', () => {
    const spy = spyOn(manipulator, 'createElement');
    service.onMousePress(eventMocker('mousepress', 0, 0, 0));
    expect(spy).toHaveBeenCalled();
    expect(service['isDrawing']).toBeTruthy();
  });

  it('#holding mouse should draw continuously', () => {

    service.onMousePress(eventMocker('mousepress', 0, 0, 0));
    const spy = spyOn(manipulator, 'createElement');
    const currentSprays = spy.calls.count();
    const waitTime = 1500;
    setTimeout(() =>
      expect(spy.calls.count()).toBeGreaterThan(currentSprays)
    , waitTime);
    expect(service['isDrawing']).toBeTruthy();
    service.onMouseRelease(eventMocker('mousemove', 0, 0, 0));
  });

});
