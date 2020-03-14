import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';
import * as CONSTANT from 'src/app/classes/constants';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { RectangleService } from '../rectangle/rectangle.service';
// tslint:disable: no-magic-numbers

describe('ShapeService', () => {

  let service: RectangleService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;
  const colorSubject =  new BehaviorSubject<Color>(new Color('#FFFFFF'));
  const opacitySubject = new BehaviorSubject<number>(1);
  // tslint:disable-next-line: no-any
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

  it('#initializeProperties should init subscription', () => {
    service.initializeProperties();
    const opacity = 0.5;
    opacitySubject.next(opacity);
    colorSubject.next(new Color('#ABCDEF'));
    expect(opacitySubject.value).toEqual(opacity);
    expect(colorSubject.value.getHex()).toEqual('#ABCDEF');
  });

  it('#updateTracingType should change traced with border', () => {
    // const spy = spyOn(service, 'cancelShapeIfOngoing');
    service['isChanging'] = true;
    service.updateTracingType('border');
    expect(service.shapeStyle.hasBorder).not.toBeTruthy();
    // expect(spy).toHaveBeenCalled();
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
    service.onMousePress(eventMocker('mouseup', 0, 0, 0));
    service.onMouseMove(eventMocker('mouseup', 0, 0, 0));
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

  it('#onMouseRelease should do nothing if single click', () => {
    const remove = spyOn(service['manipulator'], 'removeChild');
    const addElement = spyOn(service['drawStack'], 'addElementWithInfos');
    service.onMousePress(eventMocker('mouserelease', 0, 0, 0));
    service.onMouseRelease(eventMocker('mouserelease', 0, 0, 0));
    expect(service['drawOnNextMove']).not.toBeTruthy();
    expect(service['isChanging']).not.toBeTruthy();
    expect(remove).not.toHaveBeenCalled();
    expect(addElement).not.toHaveBeenCalled();
  });

  it('#onMouseRelease should stop shape', () => {
    service.onMousePress(eventMocker('mouserelease', 0, 0, 0));
    service.onMouseMove(eventMocker('mouserelease', 0, 1, 1));
    const spy = spyOn(manipulator, 'removeChild');
    const addElement = spyOn(service['drawStack'], 'addElementWithInfos');
    service.onMouseRelease(eventMocker('mouserelease', 0, 0, 0));
    expect(service['drawOnNextMove']).not.toBeTruthy();
    expect(spy).toHaveBeenCalled();
    expect(addElement).toHaveBeenCalled();
  });

  it('#onMouseMove should save mouse position only when drawing', () => {
    const coordMouse = 100;
    service['mousePosition'] = new CoordinatesXY(coordMouse, coordMouse);
    const firstPosition = service['mousePosition'];
    expect(service['mousePosition']).toEqual(new CoordinatesXY(coordMouse, coordMouse));

    service.onMouseMove(eventMocker('mousemove', 0, 0, 0));
    expect(service['mousePosition']).toEqual(firstPosition);
    service.onMousePress(eventMocker('mousemove', 0, 0, 0));
    service.onMouseMove(eventMocker('mousemove', 0, 0, 0));
    expect(service['mousePosition']).not.toEqual(firstPosition);
  });

  it('#onMouseMove should init properties', () => {
    service.onMousePress(eventMocker('mousemove', 0, 0, 0));
    expect(service['drawOnNextMove']).toBeTruthy();
    const currentGroup = service['subElement'];
    service.onMouseMove(eventMocker('mousemove', 0, 0, 0));
    expect(service['subElement']).not.toBe(currentGroup);
    expect(service['drawOnNextMove']).not.toBeTruthy();
    expect(service['isChanging']).toBeTruthy();
  });

  it('#onKeyPressed should fake mousePosition bigger height', () => {
    service.onMousePress(eventMocker('this ', 0, 200, 200));
    service.onMouseMove(eventMocker('this ', 0, 100, 0));
    expect(service['mousePosition'].getX()).toEqual(100);
    expect(service['mousePosition'].getY()).toEqual(0);

    service.onKeyPressed(new KeyboardEvent('keypress', {
      shiftKey: true
    }));
    expect(service['mousePosition'].getX()).toEqual(100);
    expect(service['mousePosition'].getY()).toEqual(100);
    expect(service['shiftPressed']).toBeTruthy();

    // nothing: shapeCorner is origin, not pointer
    service.onMouseMove(eventMocker('this ', 0, 300, 400));
    expect(service['mousePosition'].getX()).toEqual(300);
    expect(service['mousePosition'].getY()).toEqual(400);
    expect(service['shiftPressed']).toBeTruthy();

    service.onKeyReleased(new KeyboardEvent('keypress', {
      shiftKey: false
    }));
    expect(service['mousePosition'].getX()).toEqual(300);
    expect(service['mousePosition'].getY()).toEqual(400);
  });

  it('#onKeyPressed should fake mousePosition bigger width', () => {
    service.onMousePress(eventMocker('this ', 0, 200, 200));
    service.onMouseMove(eventMocker('this ', 0, 0, 100));
    expect(service['mousePosition'].getX()).toEqual(0);
    expect(service['mousePosition'].getY()).toEqual(100);

    service.onKeyPressed(new KeyboardEvent('keypress', {
      shiftKey: true
    }));
    expect(service['mousePosition'].getX()).toEqual(100);
    expect(service['mousePosition'].getY()).toEqual(100);
    expect(service['shiftPressed']).toBeTruthy();

    service.onMouseMove(eventMocker('this ', 0, 400, 300));
    expect(service['mousePosition'].getX()).toEqual(400);
    expect(service['mousePosition'].getY()).toEqual(300);
    expect(service['shiftPressed']).toBeTruthy();

    service.onKeyReleased(new KeyboardEvent('keypress', {
      shiftKey: false
    }));
    expect(service['mousePosition'].getX()).toEqual(400);
    expect(service['mousePosition'].getY()).toEqual(300);
  });

  it('#onKeyPressed shouldn\'t update size if not shift', () => {
    service.onKeyPressed(new KeyboardEvent('keypress', {
      shiftKey: false
    }));
    expect(service['shiftPressed']).not.toBeTruthy();
  });

  it('#onKeyReleased should change shift status when not drawing', () => {
    service.onKeyPressed(new KeyboardEvent('keypress', {
      shiftKey: true
    }));
    expect(service['shiftPressed']).toBeTruthy();
    service.onKeyReleased(new KeyboardEvent('keypress', {
      shiftKey: false
    }));
    expect(service['shiftPressed']).not.toBeTruthy();
  });

  it('#onKeyReleased should change shift status when drawing', () => {
    service.onMousePress(eventMocker('reeeeeeeee', 0, 0, 0));
    service.onMouseMove(eventMocker('reeeeeeeee', 0, 0, 0));
    service.onKeyPressed(new KeyboardEvent('keypress', {
      shiftKey: true
    }));
    expect(service['shiftPressed']).toBeTruthy();
    service.onKeyReleased(new KeyboardEvent('keypress', {
      shiftKey: false
    }));
    expect(service['shiftPressed']).not.toBeTruthy();
  });
});
