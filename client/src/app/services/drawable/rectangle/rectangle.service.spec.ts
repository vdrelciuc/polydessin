// tslint:disable: no-string-literal | Reason: used to access private variables
import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';
import * as CONSTANT from 'src/app/classes/constants';
import { ColorSelectorService } from 'src/app/services/color-selector/color-selector.service';
import { DrawStackService } from 'src/app/services/draw-stack/draw-stack.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { RectangleService } from './rectangle.service';
// tslint:disable: no-magic-numbers no-any
describe('RectangleService', () => {

  let service: RectangleService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;

  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  };

  const mockedPrimary = new BehaviorSubject<Color>(new Color('#FFFFFF'));
  const mockedSecondary = new BehaviorSubject<Color>(new Color('#FFFFFF'));

  // Faking a MouseEvent
  const e = {
    type: 'click',
    bubbles: true,
    cancelable: true,
    view: window,
    detail: 0,
    screenX: 1,
    screenY: 1,
    clientX: 1,
    clientY: 1,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    button: 0,
    relatedTarget: undefined,
  };

  const evt = document.createEvent('MouseEvents');
  evt.initMouseEvent(
    e.type,
    e.bubbles,
    e.cancelable,
    e.view,
    e.detail,
    e.screenX,
    e.screenY,
    e.clientX,
    e.clientY,
    e.ctrlKey,
    e.altKey,
    e.shiftKey,
    e.metaKey,
    e.button,
    document.body.parentNode
  );

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
            primaryColor: mockedPrimary,
            secondaryColor: mockedSecondary,
            primaryTransparency: new BehaviorSubject<number>(1),
            secondaryTransparency: new BehaviorSubject<number>(1),
          },
        },
        DrawStackService
      ],
    });
    service = getTestBed().get(RectangleService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>);
    service.attributes = new DrawablePropertiesService();
    service.initialize(manipulator, image,
      getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>),
      getTestBed().get<DrawStackService>(DrawStackService as Type<DrawStackService>));
    });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#constructor should set the RectangleService with its correct default attributes', () => {
    expect(service.frenchName).toBe('Rectangle');
    expect(service.shapeStyle.thickness).toBe(CONSTANT.THICKNESS_DEFAULT);
    expect(service.shapeStyle.fillColor.getHex()).toBe(CONSTANT.COLOR_DEFAULT);
    expect(service.shapeStyle.borderColor.getHex()).toBe(CONSTANT.COLOR_DEFAULT);
    expect(service.shapeStyle.hasBorder).toBe(true);
    expect(service.shapeStyle.nameDisplayDefault).toBe('[Rectangle]');
    expect(service.shapeStyle.nameDisplayOnShift).toBe('[Carré]');
  });

  it('#initializeProperties should set default properties', () => {
    service.attributes = new DrawablePropertiesService();
    service.initializeProperties();
    expect(service.colorSelectorService.primaryColor.value.getHex())
      .toBe('#FFFFFF');
  });

  it('#initializeProperties should set default properties', () => {
    service.attributes = new DrawablePropertiesService();
    service.initializeProperties();
    expect(service.colorSelectorService.primaryColor.value.getHex())
      .toBe('#FFFFFF');
  });

  it('#onMouseMove should call setDimensionsAttributes', () => {
    service.colorSelectorService.backgroundColor = new BehaviorSubject<Color>(new Color('ffffff'));
    service.onMousePress(eventMocker('', 0, 0, 0));

    const spy = spyOn(service as any, 'setDimensionsAttributes');
    service.onMouseMove(eventMocker('', 0, 0, 0));
    expect(spy).toHaveBeenCalled();
  });

  it('drawing top-left to bottom-right should call setShapeOriginFrom Lower and Right Quadrants', () => {
    service.colorSelectorService.backgroundColor = new BehaviorSubject<Color>(new Color('ffffff'));

    const spyRight = spyOn(service as any, 'setShapeOriginFromRightQuadrants');
    const spyLower = spyOn(service as any, 'setShapeOriginFromLowerQuadrants');
    service.onMousePress(eventMocker('', 0, 0, 0));
    service.onMouseMove(eventMocker('', 0, 100, 100));
    expect(spyRight).toHaveBeenCalled();
    expect(spyLower).toHaveBeenCalled();
  });

  it('drawing bottom-right to top-left should call setShapeOriginFrom Upper and Left Quadrants', () => {
    service.colorSelectorService.backgroundColor = new BehaviorSubject<Color>(new Color('ffffff'));

    const spyLeft = spyOn(service as any, 'setShapeOriginFromLeftQuadrants');
    const spyUpper = spyOn(service as any, 'setShapeOriginFromUpperQuadrants');
    service.onMousePress(eventMocker('', 0, 100, 100));
    service.onMouseMove(eventMocker('', 0, 0, 0));
    expect(spyLeft).toHaveBeenCalled();
    expect(spyUpper).toHaveBeenCalled();
  });
});
