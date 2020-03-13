import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';
import * as CONSTANT from 'src/app/classes/constants';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { RectangleService } from '../rectangle/rectangle.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';

xdescribe('ShapeService', () => {

  let service: RectangleService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;
  const colorSubject =  new BehaviorSubject<Color>(new Color('#FFFFFF'));
  const opacitySubject = new BehaviorSubject<number>(1);
  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  }

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
            primaryTransparency: opacitySubject,
            secondaryTransparency: opacitySubject
          },
        },
        DrawStackService
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
      borderOpacity: CONSTANT.OPACITY_DEFAULT,
      fillOpacity: CONSTANT.OPACITY_DEFAULT,
      hasBorder: true,
      hasFill: true,
      nameDisplayDefault: '[Rectangle]',
      nameDisplayOnShift: '[Carré]'
    };
    service.initialize(manipulator, image,
      getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>),
      getTestBed().get<DrawStackService>(DrawStackService as Type<DrawStackService>));
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

  it('#initializeProperties should init subscription', () => {
    service.initializeProperties();
    const opacity = 0.5;
    opacitySubject.next(opacity);
    colorSubject.next(new Color('#ABCDEF'));
    expect(opacitySubject.value).toEqual(opacity);
    expect(colorSubject.value.getHex()).toEqual('#ABCDEF');
  });

  it('#updateTracingType should change traced with border', () => {
    const spy = spyOn(service, 'cancelShapeIfOngoing');
    service['isChanging'] = true;
    service.updateTracingType('border');
    expect(service.shapeStyle.hasBorder).not.toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('#updateTracingType should change traced with fill', () => {
    const spy = spyOn(service, 'cancelShapeIfOngoing');
    service['isChanging'] = false;
    service.updateTracingType('fill');
    expect(service.shapeStyle.hasFill).not.toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('#cancelShape should stop shape', () => {
    service['isChanging'] = true;
    const spy = spyOn(manipulator, 'removeChild');
    service.cancelShapeIfOngoing();
    expect(spy).toHaveBeenCalledWith(image.nativeElement,
        service['subElement']);
    expect(service['isChanging']).not.toBeTruthy();
  });

  it('#onMousePress should release mouse if already drawing', () => {
    service['isChanging'] = true;
    const spy = spyOn(service, 'onMouseRelease');
    service.onMousePress(eventMocker('mouseup', 0, 0, 0));
    expect(spy).toHaveBeenCalled();
  });

  it('#onMousePress should not create rectangle', () => {
    service.onMousePress(eventMocker('mouseup', 0, 0, 0));
    expect(service['drawOnNextMove']).toBeTruthy();
  });

  it('#onMouseRelease should end drawing', () => {
    service['isChanging'] = true;
    service['drawOnNextMove'] = false;
    const spy = spyOn(manipulator, 'removeChild');
    service.onMouseRelease(eventMocker('mouseup', 0, 0, 0));
    expect(service['isChanging']).not.toBeTruthy();
    expect(service['drawOnNextMove']).not.toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('#onMousePress should create rectangle', () => {
    const spy = spyOn(CoordinatesXY, 'getEffectiveCoords');
    service.onMousePress(eventMocker('mouseup', 0, 0, 0));
    service.onMouseMove(eventMocker('mouseup', 0, 1, 1));
    expect(spy).toHaveBeenCalled();
    expect(service['drawOnNextMove']).not.toBeTruthy();
  });

  it('#onMouseRelease should remove shape if single click', () => {
    service.onMouseRelease(eventMocker('mouserelease', 0, 0, 0));
    service.onMouseRelease(eventMocker('mouserelease', 0, 0, 0));
    const remove = spyOn(manipulator, 'removeChild');
    const addElement = spyOn(service['drawStack'], 'addElementWithInfos');
    expect(service['drawOnNextMove']).not.toBeTruthy();
    expect(service['isChanging']).not.toBeTruthy();
    expect(remove).toHaveBeenCalled();
    expect(addElement).not.toHaveBeenCalled();
  });

  it('#onMouseRelease should stop shape', () => {
    service['drawOnNextMove'] = false;
    service['isChanging'] = true;
    const spy = spyOn(manipulator, 'removeChild');
    const addElement = spyOn(service['drawStack'], 'addElementWithInfos');
    service.onMouseRelease(eventMocker('mouserelease', 0, 0, 0));
    expect(service['drawOnNextMove']).not.toBeTruthy();
    expect(spy).toHaveBeenCalled();
    expect(addElement).toHaveBeenCalled();
  });

  it('#onMouseMove should save mouse position only when drawing', () => {
    service['isChanging'] = false;
    const coordMouse = 100;
    service['mousePosition'] = new CoordinatesXY(coordMouse, coordMouse);
    const firstPosition = service['mousePosition'];
    expect(service['mousePosition']).toEqual(new CoordinatesXY(coordMouse, coordMouse));

    service.onMouseMove(eventMocker('mousemove', 0, 0, 0));
    expect(service['mousePosition']).toEqual(firstPosition);
    service['isChanging'] = true;
    service.onMouseMove(eventMocker('mousemove', 0, 0, 0));
    expect(service['mousePosition']).not.toEqual(firstPosition);
  });

  it('#onMouseMove should init properties', () => {
    service['isChanging'] = false;
    service['drawOnNextMove'] = true;
    const spy = spyOn(manipulator, 'createElement');
    const spy2 = spyOn(manipulator, 'appendChild');
    service.onMouseMove(eventMocker('mousemove', 0, 0, 0));
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(service['drawOnNextMove']).not.toBeTruthy();
    expect(service['isChanging']).toBeTruthy();
  });

  it('#onKeyPressed should update size with shift', () => {
    service['shiftPressed'] = false;
    service['isChanging'] = true;
    service['mousePosition'] = new CoordinatesXY(0, 0);
    service['shapeOrigin'] = new CoordinatesXY(10, 10);
    service['text'] = manipulator.createElement('text', 'http://www.w3.org/2000/svg');
    service.onKeyPressed(new KeyboardEvent('keypress', {
      shiftKey: true
    }));
    expect(service['mousePosition'].getX()).toEqual(0);
    expect(service['mousePosition'].getY()).toEqual(0);
    expect(service['shiftPressed']).toBeTruthy();
  });

  it('#onKeyPressed should update size bigger height', () => {
    const height = 200;
    const width = 100;
    const center = 200;

    const heightChange = spyOn(service['mousePosition'], 'setX');
    let timesChanged = heightChange.calls.count();
    service.onMousePress(eventMocker('this ', 0, center, center));
    expect(heightChange.calls.count()).toEqual(timesChanged);

    service.onMouseMove(eventMocker('this ', 0, center - height, center - width));
    expect(heightChange.calls.count()).toEqual(timesChanged);

    service.onKeyPressed(new KeyboardEvent('keypress', {
      shiftKey: true
    }));
    expect(heightChange.calls.count()).toBeGreaterThan(timesChanged);
    expect(service['shiftPressed']).toBeTruthy();
    timesChanged = heightChange.calls.count();

    service.onMouseMove(eventMocker('this ', 0, center + height, center + width));
    expect(heightChange.calls.count()).toBeGreaterThan(timesChanged);
    expect(service['shiftPressed']).toBeTruthy();
    timesChanged = heightChange.calls.count();

    service.onKeyReleased(new KeyboardEvent('keypress', {
      shiftKey: false
    }));
    expect(heightChange.calls.count()).toBeGreaterThan(timesChanged);
    timesChanged = heightChange.calls.count();
  });

  it('#onKeyPressed should update size bigger width', () => {
    const height = 100;
    const width = 200;
    const center = 200;

    const heightChange = spyOn(service['mousePosition'], 'setX');
    let timesChanged = heightChange.calls.count();
    service.onMousePress(eventMocker('this ', 0, center, center));
    expect(heightChange.calls.count()).toEqual(timesChanged);

    service.onMouseMove(eventMocker('this ', 0, center - height, center - width));
    expect(heightChange.calls.count()).toEqual(timesChanged);

    service.onKeyPressed(new KeyboardEvent('keypress', {
      shiftKey: true
    }));
    expect(heightChange.calls.count()).toBeGreaterThan(timesChanged);
    expect(service['shiftPressed']).toBeTruthy();
    timesChanged = heightChange.calls.count();

    service.onMouseMove(eventMocker('this ', 0, center + height, center + width));
    expect(heightChange.calls.count()).toBeGreaterThan(timesChanged);
    expect(service['shiftPressed']).toBeTruthy();
    timesChanged = heightChange.calls.count();

    service.onKeyReleased(new KeyboardEvent('keypress', {
      shiftKey: false
    }));
    expect(heightChange.calls.count()).toBeGreaterThan(timesChanged);
    timesChanged = heightChange.calls.count();
  });

  it('#onKeyPressed shouldn\'t update size if not shift', () => {
    service.onKeyPressed(new KeyboardEvent('keypress', {
      shiftKey: false
    }));
    expect(service['shiftPressed']).not.toBeTruthy();
  });

  it('#onKeyReleased should change shift status when not drawing', () => {
    service['shiftPressed'] = true;
    service['isChanging'] = false;
    service.onKeyReleased(new KeyboardEvent('keypress', {
      shiftKey: false
    }));
    expect(service['shiftPressed']).not.toBeTruthy();
  });

  it('#onKeyReleased should change shift status when drawing', () => {
    service.onMousePress(eventMocker('reeeeeeeee', 0, 0, 0));

    service['shiftPressed'] = true;
    service.onKeyReleased(new KeyboardEvent('keypress', {
      shiftKey: false
    }));
    expect(service['shiftPressed']).not.toBeTruthy();
  });

  it('#onKeyReleased shouldn\'t change shift status', () => {
    service['shiftPressed'] = true;
    service.onKeyReleased(new KeyboardEvent('keypress', {
      shiftKey: true
    }));
    expect(service['shiftPressed']).toBeTruthy();
  });

});
