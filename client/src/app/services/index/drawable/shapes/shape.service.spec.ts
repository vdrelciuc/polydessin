import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';
import * as CONSTANT from 'src/app/classes/constants';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { RectangleService } from '../rectangle/rectangle.service';

describe('ShapeService', () => {

  const shapeService: RectangleService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;
  let service: any;
  const colorSubject =  new BehaviorSubject<Color>(new Color('#FFFFFF'));
  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  }

  const eventMocker = (event: string, keyUsed: number) =>
      new MouseEvent(event, {button: keyUsed, clientX: 10, clientY: 10});

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
            primaryTransparency: new BehaviorSubject<number>(1),
            secondaryTransparency: new BehaviorSubject<number>(1)
          },
        },
      ],
    });
    service = getTestBed().get(RectangleService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>);
    service.attributes = new DrawablePropertiesService();
    service.shapeStyle = {
      thickness: CONSTANT.THICKNESS_DEFAULT,
      borderColor: new Color(CONSTANT.DEFAULT_PRIMARY_COLOR),
      fillColor: new Color(CONSTANT.COLOR_DEFAULT),
      borderOpacity: parseInt(CONSTANT.OPACITY_DEFAULT, CONSTANT.DECIMAL_BASE),
      fillOpacity: parseInt(CONSTANT.OPACITY_DEFAULT, CONSTANT.DECIMAL_BASE),
      hasBorder: true,
      hasFill: true,
      nameDisplayDefault: '[Rectangle]',
      nameDisplayOnShift: '[Carré]'
    };
    service.initialize(manipulator, image,
    shapeService.initialize(manipulator, image,
      getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>)));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('#initializeProperties should set default properties', () => {
  //   service.initializeProperties();
  //   expect(service.shapeStyle.borderColor.getHex()).toEqual(service.attributes.color.getValue());
  // });

  // it('#initializeProperties should initialize subscriptions', () => {
  //   const randomTestValue = '#ABCDEF';
  //   service.initializeProperties();
  //   service.attributes.color.next(randomTestValue);
  //   expect(service.shapeStyle.borderColor.getHex()).toEqual(randomTestValue);
  // });

  it('#onMousePress should release mouse out of canvas', () => {
    service.isChanging = true;
    service.drawOnNextMove = false;
    const spy = spyOn(service, 'onMouseRelease');
    const spy2 = spyOn(manipulator, 'removeChild');
    service.onMousePress(eventMocker('mouseup', 0));
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(service.isChanging).not.toBeTruthy();
  });

  it('#onMousePress should not create rectangle', () => {
    service.isChanging = true;
    service.drawOnNextMove = true;
    const spy = spyOn(service, 'onMouseRelease');
    service.onMousePress(eventMocker('mouseup', 0));
    expect(spy).toHaveBeenCalled();
    expect(service.drawOnNextMove).toBeTruthy();
    it('#initializeProperties should define subscriptions', () => {
    const properties = new DrawablePropertiesService();
    const newColor = '#ABCDEF';
    shapeService.initializeProperties();
    properties.fillColor.next(newColor);
    properties.color.next(newColor);
    expect(shapeService.shapeStyle.fillColor.getHex()).toBe(newColor);
    expect(shapeService.shapeStyle.borderColor.getHex()).toBe(newColor);
  });

    it('#onMousePress should create rectangle', () => {
    service.isChanging = false;
    service.drawOnNextMove = true;
    const spy2 = spyOn(CoordinatesXY, 'getEffectiveCoords');
    service.onMousePress(eventMocker('mouseup', 0));
    expect(spy2).toHaveBeenCalled();
    expect(service.drawOnNextMove).toBeTruthy();
  });

    it('#onMouseRelease should remove shape', () => {
    service.drawOnNextMove = true;
    service.onMouseRelease(eventMocker('mouserelease', 0));
    expect(service.drawOnNextMove).not.toBeTruthy();
  });

    it('#onMouseRelease should stop shape', () => {
    service.drawOnNextMove = false;
    const spy2 = spyOn(manipulator, 'removeChild');
    service.onMouseRelease(eventMocker('mouserelease', 0));
    expect(service.drawOnNextMove).not.toBeTruthy();
    expect(spy2).toHaveBeenCalled();
  });

    it('#onMouseMove should save mouse position', () => {
    service.isChanging = false;
    service.drawOnNextMove = true;
    service.onMouseMove(eventMocker('mousemove', 0));

    service.isChanging = true;
    service.mousePosition = new CoordinatesXY(100, 100);
    service.shapeOrigin = new CoordinatesXY(10, 10);
    service.onMouseMove(eventMocker('mousemove', 0));
    expect(service.mousePosition.getX()).toEqual(10);
    expect(service.mousePosition.getY()).toEqual(10);
  });

    it('#onMouseMove should save mouse position', () => {
    service.isChanging = false;
    service.drawOnNextMove = true;
    service.onMouseMove(eventMocker('mousemove', 0));

    service.isChanging = true;
    service.shiftPressed = true;
    service.mousePosition = new CoordinatesXY(100, 100);
    service.shapeOrigin = new CoordinatesXY(10, 10);
    service.onMouseMove(eventMocker('mousemove', 0));
    expect(service.mousePosition.getX()).toEqual(10);
    expect(service.mousePosition.getY()).toEqual(10);
  });

    it('#onMouseMove should init properties', () => {
    service.isChanging = false;
    service.drawOnNextMove = true;
    const spy3 = spyOn(manipulator, 'createElement');
    const spy2 = spyOn(manipulator, 'appendChild');
    service.onMouseMove(eventMocker('mousemove', 0));
    expect(spy3).toHaveBeenCalledTimes(3);
    expect(spy2).toHaveBeenCalledTimes(3);
    expect(service.drawOnNextMove).not.toBeTruthy();
  });

    it('#onKeyPressed should update size with shift', () => {
    service.shiftPressed = false;
    service.isChanging = true;
    service.mousePosition = new CoordinatesXY(0, 0);
    service.shapeOrigin = new CoordinatesXY(10, 10);
    service.text = manipulator.createElement('text', 'http://www.w3.org/2000/svg');
    service.onKeyPressed(new KeyboardEvent('keypress', {
      shiftKey: true
    }));
    expect(service.mousePosition.getX()).toEqual(0);
    expect(service.mousePosition.getY()).toEqual(0);
    expect(service.shiftPressed).toBeTruthy();
  });

    it('#onKeyPressed should update size bigger height', () => {
    service.shiftPressed = false;
    service.isChanging = true;
    service.mousePosition = new CoordinatesXY(100, 200);
    service.shapeOrigin = new CoordinatesXY(10, 10);
    service.text = manipulator.createElement('text', 'http://www.w3.org/2000/svg');
    service.onKeyPressed(new KeyboardEvent('keypress', {
      shiftKey: true
    }));
    expect(service.mousePosition.getX()).toEqual(100);
    expect(service.mousePosition.getY()).toEqual(200);
    expect(service.shiftPressed).toBeTruthy();
  });

    it('#onKeyPressed should update size bigger width', () => {
    service.shiftPressed = false;
    service.isChanging = true;
    service.mousePosition = new CoordinatesXY(200, 100);
    service.shapeOrigin = new CoordinatesXY(10, 10);
    service.text = manipulator.createElement('text', 'http://www.w3.org/2000/svg');
    service.onKeyPressed(new KeyboardEvent('keypress', {
      shiftKey: true
    }));
    expect(service.mousePosition.getX()).toEqual(200);
    expect(service.mousePosition.getY()).toEqual(100);
    expect(service.shiftPressed).toBeTruthy();
  });

    it('#onKeyPressed shouldn\'t update size with shift', () => {
    service.onKeyPressed(new KeyboardEvent('keypress', {
      shiftKey: false
    }));
    expect(service.shiftPressed).not.toBeTruthy();
  });

    it('#onKeyReleased should change shift status without update', () => {
    service.mousePositionOnShiftPress = new CoordinatesXY(10, 10);
    service.shiftPressed = true;
    service.isChanging = false;
    service.onKeyReleased(new KeyboardEvent('keypress', {
      shiftKey: false
    }));
    expect(service.shiftPressed).not.toBeTruthy();
    expect(service.mousePosition.getX()).toEqual(10);
    expect(service.mousePosition.getY()).toEqual(10);
  });

    it('#onKeyReleased should change shift status with update', () => {
    service.isChanging = false;
    service.drawOnNextMove = true;
    service.onMouseMove(eventMocker('mousemove', 0));

    service.mousePositionOnShiftPress = new CoordinatesXY(10, 10);
    service.shapeOrigin = new CoordinatesXY(10, 10);
    service.shiftPressed = true;
    service.isChanging = true;
    service.onKeyReleased(new KeyboardEvent('keypress', {
      shiftKey: false
    }));
    expect(service.shiftPressed).not.toBeTruthy();
  });

    it('#onKeyReleased shouldn\'t change shift status', () => {
    service.shiftPressed = true;
    service.onKeyReleased(new KeyboardEvent('keypress', {
      shiftKey: true
    }));
    expect(service.shiftPressed).toBeTruthy();
  });

}) });
