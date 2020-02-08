import { TestBed, getTestBed } from '@angular/core/testing';

import { LineService } from './line.service';
import { Renderer2, ElementRef, Type } from '@angular/core';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { Tools } from 'src/app/enums/tools';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { Color } from 'src/app/classes/color';
import { BehaviorSubject } from 'rxjs';
import { Stack } from 'src/app/classes/stack';

describe('LineService', () => {
  let service: LineService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;
  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  }

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
            primaryColor: new BehaviorSubject<Color>(new Color('#FFFFFF')),
            primaryTransparency: new BehaviorSubject<number>(1),
          },
        },
      ],
    });
    service = getTestBed().get(LineService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>)
    service.attributes = new DrawablePropertiesService();
    service.initialize(manipulator, image, getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>));
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

  it('#onMouseMove should add preview point', () => {
    service['isStarted'] = true;
    const spy = spyOn(CoordinatesXY, 'effectiveX');
    const spy2 = spyOn(CoordinatesXY, 'effectiveY');
    service.onMouseMove(new MouseEvent('mousemove', {clientX: 100, clientY: 100}));
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('#onMouseMove should add preview point with shift', () => {
    service['isStarted'] = true;
    service['shiftPressed'] = true;
    let mockedPoints = new Stack<CoordinatesXY>();
    mockedPoints.push_back(new CoordinatesXY(10,10));
    service['points'] = mockedPoints;
    const spy = spyOn(service['points'], 'getLast');
    service.onMouseMove(new MouseEvent('mousemove', {clientX: 100, clientY: 100}));
    expect(spy).toHaveBeenCalled();
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

  it('#addPointToLine should add point to line with shift pressed', () => {
    let mockedPoints = new Stack<CoordinatesXY>();
    mockedPoints.push_back(new CoordinatesXY(10,10));
    const lastPoint = new CoordinatesXY(100,100);
    mockedPoints.push_back(lastPoint);
    service['points'] = mockedPoints;
    service['shiftPressed'] = true;
    const spy = spyOn<CoordinatesXY>(lastPoint, "getClosestPoint");
    service.addPointToLine(2,2);
    expect(spy).toHaveBeenCalled();
  });

  it('#addPointToLine should add point to line without shift pressed', () => {
    const point = new CoordinatesXY(1,1);
    const spy = spyOn<CoordinatesXY>(point, "getClosestPoint");
    service.addPointToLine(point.getX(), point.getY());
    service.onKeyReleased(new KeyboardEvent('keyup', {shiftKey: false}));
    service.addPointToLine(2,2);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('#onDoubleClick should be the first point', () => {
    service['isDone'] = false;
    service['isStarted'] = true;
    service.onDoubleClick(new MouseEvent('mousepress', {}));
    expect(service['isStarted']).not.toBeTruthy();
    expect(service['isDone']).toBeTruthy();
  });

  it('#onDoubleClick should not be within 3px', () => {
    let mockedPoints = new Stack<CoordinatesXY>();;
    mockedPoints.push_back(new CoordinatesXY(10,10));
    const lastPoint = new CoordinatesXY(100,100);
    mockedPoints.push_back(lastPoint);
    service['points'] = mockedPoints;
    service['isDone'] = false;
    service['isStarted'] = true;
    const spy = spyOn(service, 'addPointToLine');
    service.onDoubleClick(new MouseEvent('mousepress', {
      clientX: 100,
      clientY: 100
    }));
    expect(spy).not.toHaveBeenCalledWith(10,10);
  });

  it('#onDoubleClick should be within 3px', () => {
    let mockedPoints = new Stack<CoordinatesXY>();;
    mockedPoints.push_back(new CoordinatesXY(10,10));
    const lastPoint = new CoordinatesXY(100,100);
    mockedPoints.push_back(lastPoint);
    service['points'] = mockedPoints;
    service['isDone'] = false;
    service['isStarted'] = true;
    const spy = spyOn(service, 'addPointToLine');
    service.onDoubleClick(new MouseEvent('mousepress', {
      clientX: 11,
      clientY: 11
    }));
    expect(spy).toHaveBeenCalledWith(10,10);
  });

  it('#onClick should add point', () => {
    service['isStarted'] = true;
    const spy = spyOn(service, 'addPointToLine');
    const event = new MouseEvent('mouseclick', {
      clientX: 100,
      clientY: 100
    });
    service.onClick(event);
    const effectivePoint = CoordinatesXY.getEffectiveCoords(image, event);
    expect(spy).toHaveBeenCalledWith(effectivePoint.getX(), effectivePoint.getY());
  });

  it('#onClick should add point with dot connection', () => {
    service['isStarted'] = true;
    service['jointIsDot'] = true;
    const spy = spyOn(service, 'addPointToLine');
    const spy2 = spyOn(manipulator, 'appendChild');
    const event = new MouseEvent('mouseclick', {
      clientX: 100,
      clientY: 100
    });
    service.onClick(event);
    const effectivePoint = CoordinatesXY.getEffectiveCoords(image, event);
    expect(spy).toHaveBeenCalledWith(effectivePoint.getX(), effectivePoint.getY());
    expect(service['circles'].getAll().length).not.toEqual(0);
    expect(spy2).toHaveBeenCalled();
  });

  it('#onClick should add first point', () => {
    const spy = spyOn(service, 'addPointToLine');
    const spy2 = spyOn(manipulator, 'appendChild');
    const event = new MouseEvent('mouseclick', {
      clientX: 100,
      clientY: 100
    });
    service.onClick(event);
    const effectivePoint = CoordinatesXY.getEffectiveCoords(image, event);
    expect(spy).toHaveBeenCalledWith(effectivePoint.getX(), effectivePoint.getY());
    expect(spy2).toHaveBeenCalledTimes(2);
  });

  it('#deleteLine should clear everything', () => {
    service.deleteLine();
    expect(service['isDone']).toBeTruthy();
    expect(service['isStarted']).not.toBeTruthy();
    expect(service['points'].getRoot()).toBe(undefined)
  });

  it('#removeLastPoint should remove last point with junction is dot', () => {
    service['jointIsDot'] = true;
    const spy = spyOn(service['circles'], 'pop_back');
    const spy2 = spyOn(service['points'], 'pop_back');
    service.removeLastPoint();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('#removeLastPoint should remove last point', () => {
    const spy = spyOn(service['points'], 'pop_back');
    service.removeLastPoint();
    expect(spy).toHaveBeenCalled();
  });
});
