// tslint:disable: no-any
import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { Color } from '../classes/color';
import { ColorType } from '../enums/color-types';
import { ColorSelectorService } from './color-selector.service';
import { DrawablePropertiesService } from './index/drawable/properties/drawable-properties.service';
import { PipetteService } from './pipette.service';
import { DrawStackService } from './tools/draw-stack/draw-stack.service';

describe('PipetteService', () => {
  let service: PipetteService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;
  const colorSubject =  new BehaviorSubject<Color>(new Color('#FFFFFF'));
  const opacitySubject = new BehaviorSubject<number>(1);

  let updatedColor: Color;

  const LEFT_CLICK = 0;
  const RIGHT_CLICK = 2;

  const mockedUpdateColor = (newColor: Color): void => {
    updatedColor = newColor;
  };

  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  };

  const createCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const CANVAS_SIZE = 100;
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    const ctx = canvas.getContext('2d');
    if (ctx !== null) {
      ctx.fillStyle = '#055555';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return canvas;
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
            },
          },
        },
        {
          provide: ColorSelectorService,
          useValue: {
            primaryColor: colorSubject,
            secondaryColor: colorSubject,
            backgroundColor: colorSubject,
            primaryTransparency: opacitySubject,
            secondaryTransparency: opacitySubject
          },
        },
        DrawStackService
      ],
    });
    service = getTestBed().get(PipetteService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>);
    service['attributes'] = new DrawablePropertiesService();
    service.initialize(manipulator, image,
      getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>),
      getTestBed().get<DrawStackService>(DrawStackService as Type<DrawStackService>));

    service.setupCanvas(createCanvas());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#endTool should set cursor back to default', () => {
    const spy = spyOn<any>(service['manipulator'], 'setAttribute');
    service.endTool();
    expect(spy).toHaveBeenCalled();
  });

  it('#onSelect should set cursor to crosshair', () => {
    service['image'].nativeElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    const spy = spyOn<any>(service['manipulator'], 'setAttribute');
    service.onSelect();
    expect(spy).toHaveBeenCalled();
  });

  it('#onSelect should canvas be null', () => {
    service['image'].nativeElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['hiddenCanvas'].getContext = jasmine.createSpy().and.returnValue(null);
    const spy = spyOn<any>(service['manipulator'], 'setAttribute');
    service.onSelect();
    expect(spy).toHaveBeenCalled();
  });

  it('#onClick should set new primary color on left click', () => {
    const mockedEvent: MouseEvent = eventMocker('click', LEFT_CLICK, 0, 0);
    service['image'].nativeElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    service['colorSelectorService'].updateColor = jasmine.createSpy().and.callFake(mockedUpdateColor);
    service.onClick(mockedEvent);

    expect(updatedColor.getHex()).toBe('#055555');
    expect(service['colorSelectorService'].colorToChange).toBe(ColorType.Primary);
  });

  it('#onClick should set new secondary color on right click', () => {
    const mockedEvent: MouseEvent = eventMocker('click', RIGHT_CLICK, 0, 0);
    service['image'].nativeElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    service['colorSelectorService'].updateColor = jasmine.createSpy().and.callFake(mockedUpdateColor);
    service.onClick(mockedEvent);

    expect(updatedColor.getHex()).toBe('#055555');
    expect(service['colorSelectorService'].colorToChange).toBe(ColorType.Secondary);
  });

  it('#onClick should not set new primary color if canvas is not found on left click', () => {
    const mockedEvent: MouseEvent = eventMocker('click', LEFT_CLICK, 0, 0);
    service['image'].nativeElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    let spyHasBeenCalled = false;
    service['colorSelectorService'].updateColor = jasmine.createSpy().and.callFake(() => spyHasBeenCalled = true);
    service['hiddenCanvas'].getContext = jasmine.createSpy().and.returnValue(null);
    service.onClick(mockedEvent);

    expect(spyHasBeenCalled).toBe(false);
  });

  it('#onClick should not set new primary color if canvas is not found on right click', () => {
    const mockedEvent: MouseEvent = eventMocker('click', RIGHT_CLICK, 0, 0);
    service['image'].nativeElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    let spyHasBeenCalled = false;
    service['colorSelectorService'].updateColor = jasmine.createSpy().and.callFake(() => spyHasBeenCalled = true);
    service['hiddenCanvas'].getContext = jasmine.createSpy().and.returnValue(null);
    service.onClick(mockedEvent);

    expect(spyHasBeenCalled).toBe(false);
  });
});
