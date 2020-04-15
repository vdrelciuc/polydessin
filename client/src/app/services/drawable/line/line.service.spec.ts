import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { Stack } from 'src/app/classes/stack';
import { Tools } from 'src/app/enums/tools';
import { ColorSelectorService } from 'src/app/services/color-selector/color-selector.service';
import { DrawStackService } from 'src/app/services/draw-stack/draw-stack.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { LineService } from './line.service';
// tslint:disable: no-magic-numbers no-any

describe('LineService', () => {
  let service: LineService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;
  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  };
  let spyPushSVG: jasmine.Spy<InferableFunction>;

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
          },
        },
        DrawStackService
      ],
    });
    service = getTestBed().get(LineService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>);
    service['pointerPosition'] = new CoordinatesXY(10, 10);
    service['opacity'] = 0.5;
    service['dotDiameter'] = 5;
    service['thickness'] = 10;
    service.attributes = new DrawablePropertiesService();
    service.initialize(manipulator, image,
      getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>),
      getTestBed().get<DrawStackService>(DrawStackService as Type<DrawStackService>));

    spyPushSVG = (service['pushElement'] = jasmine.createSpy().and.callFake(() => null));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get name', () => {
    expect(LineService.getName()).toEqual(Tools.Line);
  });

  it('should set default properties', () => {
    service.initializeProperties();
    expect(service.thickness).toEqual(service.attributes.thickness.value);
    expect(service.dotDiameter).toEqual(service.attributes.dotDiameter.value);
    expect(service.jointIsDot).toEqual(service.attributes.junction.value);
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

  it('#onMouseMove should add preview point with shift', () => {
    service['isStarted'] = true;
    service['shiftPressed'] = true;
    const mockedPoints = new Stack<CoordinatesXY>();
    mockedPoints.pushBack(new CoordinatesXY(10, 10));
    service['points'] = mockedPoints;
    const spy = spyOn(service['points'], 'getLast');
    service.onMouseMove(new MouseEvent('mousemove', {clientX: 100, clientY: 100}));
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseMove should update preview with shift', () => {
    service.addPointToLine(100, 100);
    service['isStarted'] = true;
    service['shiftPressed'] = true;
    const spy = spyOn(CoordinatesXY, 'effectiveX');
    const spy2 = spyOn(CoordinatesXY, 'effectiveY');
    service.onMouseMove(
      new MouseEvent('keydown', {
        clientX: 200,
        clientY: 200
    }));
    expect(spy).toHaveBeenCalledWith(image, 200);
    expect(spy2).toHaveBeenCalledWith(image, 200);
  });

  it('#onKeyPressed should change shift status', () => {
    service['shiftPressed'] = false;
    service.onKeyPressed(
      new KeyboardEvent('keydown', {shiftKey: true})
    );
    expect(service['shiftPressed']).toBeTruthy();
  });

  it('#onKeyPressed shouldn\'t change shift status', () => {
    service['shiftPressed'] = false;
    service.onKeyPressed(
      new KeyboardEvent('keydown', {shiftKey: false})
    );
    expect(service['shiftPressed']).not.toBeTruthy();
  });

  it('#onKeyReleased should change shift status', () => {
    service['shiftPressed'] = true;
    service.onKeyReleased(
      new KeyboardEvent('keyup', {shiftKey: true})
    );
    expect(service['shiftPressed']).toBeTruthy();
  });

  it('#onKeyReleased shouldn\'t change shift status', () => {
    service['shiftPressed'] = true;
    service.onKeyReleased(
      new KeyboardEvent('keyup', {shiftKey: false})
    );
    expect(service['shiftPressed']).not.toBeTruthy();
  });

  it('#onKeyReleased should update view when drawing', () => {
    service.onKeyPressed(
      new KeyboardEvent('keyup', {shiftKey: true})
    );
    const event = new MouseEvent('mouseclick', { clientX: 100, clientY: 100 });
    service.onMouseMove(event);
    service.onClick(event);
    const spy = spyOn(service as any, 'followPointer');
    service.onKeyReleased(
      new KeyboardEvent('keyup', {shiftKey: false})
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(service['shiftPressed']).not.toBeTruthy();

    service.onKeyPressed(
      new KeyboardEvent('keyup', {shiftKey: true})
      );
    expect(spy).toHaveBeenCalledTimes(2);
    expect(service['shiftPressed']).toBeTruthy();
  });

  it('#addPointToLine should add point to line without shift pressed', () => {
    const point = new CoordinatesXY(1, 1);
    const spy = spyOn<CoordinatesXY>(point, 'getClosestPoint');
    service.addPointToLine(point.getX(), point.getY());
    service.onKeyReleased(new KeyboardEvent('keyup', {shiftKey: false}));
    service.addPointToLine(2, 2);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('#onDoubleClick should be the first point', () => {
    service['isDone'] = false;
    service['isStarted'] = true;
    service.onDoubleClick(new MouseEvent('mousepress', {}));
    expect(service['isStarted']).not.toBeTruthy();
    expect(service['isDone']).toBeTruthy();
    expect(spyPushSVG).toHaveBeenCalled();
  });

  it('#onDoubleClick should not be within 3px', () => {
    const mockedPoints = new Stack<CoordinatesXY>();
    mockedPoints.pushBack(new CoordinatesXY(10, 10));
    const lastPoint = new CoordinatesXY(100, 100);
    mockedPoints.pushBack(lastPoint);
    service['points'] = mockedPoints;
    service['isDone'] = false;
    service['isStarted'] = true;
    const spy = spyOn(service, 'addPointToLine');
    service.onDoubleClick(new MouseEvent('mousepress', {
      clientX: 100,
      clientY: 100
    }));
    expect(spy).not.toHaveBeenCalledWith(10, 10);
    expect(spyPushSVG).toHaveBeenCalled();
  });

  it('#onDoubleClick should be within 3px', () => {
    service.onMouseMove(new MouseEvent('mousepress', { clientX: 10, clientY: 10 }));
    service.onClick(new MouseEvent('mousepress', { clientX: 10, clientY: 10 }));

    service.onMouseMove(new MouseEvent('mousepress', { clientX: 101, clientY: 110 }));
    service.onClick(new MouseEvent('mousepress', { clientX: 101, clientY: 110 }));

    service.onMouseMove(new MouseEvent('mousepress', { clientX: 11, clientY: 11 }));
    service.onClick(new MouseEvent('mousepress', { clientX: 11, clientY: 11 }));
    const spy = spyOn(service, 'addPointToLine');

    service.onClick(new MouseEvent('mousepress', { clientX: 11, clientY: 11 }));
    expect(spy).toHaveBeenCalled();
    const spyCount = spy.calls.count();
    service.onDoubleClick(new MouseEvent('mousepress', { clientX: 11, clientY: 11 }));
    expect(spy.calls.count()).toEqual(spyCount);
    expect(service['points'].size()).toEqual(0);
    expect(spyPushSVG).toHaveBeenCalled();
  });

  it('#onClick should add point', () => {
    service['isStarted'] = true;
    const spy = spyOn(service, 'addPointToLine');
    const event = new MouseEvent('mouseclick', { clientX: 100, clientY: 100 });
    service.onClick(event);
    const effectivePoint = CoordinatesXY.getEffectiveCoords(image, event);
    expect(spy).toHaveBeenCalledWith(effectivePoint.getX(), effectivePoint.getY());
  });

  it('#onClick should add point with shift and dots', () => {
    service.onKeyPressed(new KeyboardEvent('', {shiftKey: true}));
    service.jointIsDot = true;
    let event = new MouseEvent('mouseclick', { clientX: 100, clientY: 100 });
    service.onMouseMove(event);
    service.onClick(event);
    service.onClick(event);
    let effectivePoint = CoordinatesXY.getEffectiveCoords(image, event);
    const spy = spyOn(service, 'addPointToLine');

    event = new MouseEvent('mouseclick', { clientX: 100, clientY: 151 });
    effectivePoint = CoordinatesXY.getEffectiveCoords(image, event);
    service.onMouseMove(event);

    service.onClick(event);
    expect(spy).toHaveBeenCalledWith(effectivePoint.getX(), effectivePoint.getY());
  });

  it('#onClick should add point with dot connection', () => {
    service['isStarted'] = true;
    service['jointIsDot'] = true;
    const spy = spyOn(service, 'addPointToLine');
    const spy2 = spyOn(manipulator, 'appendChild');
    const event = new MouseEvent('mouseclick', { clientX: 100, clientY: 100 });
    service.onClick(event);
    const effectivePoint = CoordinatesXY.getEffectiveCoords(image, event);
    expect(spy).toHaveBeenCalledWith(effectivePoint.getX(), effectivePoint.getY());
    expect(service['circles'].getAll().length).not.toEqual(0);
    expect(spy2).toHaveBeenCalled();
  });

  it('#onClick should add first point', () => {
    const spy = spyOn(service, 'addPointToLine');
    const spy2 = spyOn(manipulator, 'appendChild');
    const event = new MouseEvent('mouseclick', { clientX: 100, clientY: 100 });
    service.onClick(event);
    const effectivePoint = CoordinatesXY.getEffectiveCoords(image, event);
    expect(spy).toHaveBeenCalledWith(effectivePoint.getX(), effectivePoint.getY());
    expect(spy2).toHaveBeenCalledTimes(2);
  });

  it('#deleteLine should clear everything', () => {
    service.onMouseMove(new MouseEvent('mousepress', { clientX: 11, clientY: 11 }));
    service.onClick(new MouseEvent('mousepress', { clientX: 11, clientY: 11 }));
    service.deleteLine();
    expect(service['isDone']).toBeTruthy();
    expect(service['isStarted']).not.toBeTruthy();
    expect(service['points'].getRoot()).toBeUndefined();
  });

  it('#removeLastPoint should remove last point with junction is dot', () => {
    service.addPointToLine(100, 100);
    service.addPointToLine(105, 105);
    service['jointIsDot'] = true;
    service['shiftPressed'] = false;
    const spy = spyOn(service['manipulator'], 'removeChild');
    service.removeLastPoint();
    expect(spy).toHaveBeenCalled();
  });

  it('#removeLastPoint should remove last point', () => {
    service.addPointToLine(100, 100);
    service.addPointToLine(105, 105);
    service['jointIsDot'] = true;
    service['shiftPressed'] = false;
    const spy = spyOn(service['points'], 'pop_back');
    service.removeLastPoint();
    expect(spy).toHaveBeenCalled();
  });

  it('#removeLastPoint should remove last point', () => {
    service.addPointToLine(100, 100);
    service.addPointToLine(105, 105);
    const spy = spyOn(service['points'], 'pop_back');
    service['shiftPressed'] = false;
    service.removeLastPoint();
    expect(spy).toHaveBeenCalled();
  });

  it('#endTool should remove everything', () => {
    const mockedRemoveChild = (el: SVGGElement): void => { /*Much Wow*/ };
    service.onMouseMove(new MouseEvent('mousepress', { clientX: 11, clientY: 11 }));
    service.onClick(new MouseEvent('mousepress', { clientX: 11, clientY: 11 }));
    service.onMouseMove(new MouseEvent('mousepress', { clientX: 11, clientY: 11 }));
    const removeChild = (service['subElement'].remove = jasmine.createSpy().and.callFake(mockedRemoveChild));
    let removeCount = removeChild.calls.count();
    service['endTool']();
    expect(removeChild.calls.count()).toBeGreaterThan(removeCount);
    removeCount = removeChild.calls.count();

    service['endTool']();

    service.onMouseMove(new MouseEvent('mousepress', { clientX: 11, clientY: 11 }));
    expect(removeChild.calls.count()).toEqual(removeCount);
  });
});
