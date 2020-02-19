import { getTestBed, TestBed } from '@angular/core/testing';
import { ElementRef, Renderer2, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';
import * as CONSTANT from 'src/app/classes/constants';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { RectangleService } from './rectangle.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
// import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';

describe('RectangleService', () => {

  let service: RectangleService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;

  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  }

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
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>)
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

  // it('#setShapeOriginFromRightQuadrants should set all attributes', () => {
  //   service['isChanging'] = false;
  //   service['drawOnNextMove'] = true;
  //   service.onMouseMove(new MouseEvent('mousemove', {}));

  //   service['isChanging'] = true;
  //   service['shapeOrigin'] = new CoordinatesXY(0,0);
  //   const spy = spyOn(manipulator, 'setAttribute');
  //   service.onMouseMove(new MouseEvent('mousemove', {}));
  //   expect(service['shiftPressed']).toBeTruthy();
  //   expect(spy).toHaveBeenCalled();
  // });
});
