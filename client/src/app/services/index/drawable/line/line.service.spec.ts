import { TestBed, getTestBed } from '@angular/core/testing';

import { LineService } from './line.service';
import { Renderer2, ElementRef, Type } from '@angular/core';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { Tools } from 'src/app/enums/tools';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { ColorSelectorService } from 'src/app/services/color-selector.service';

describe('LineService', () => {
  let line: LineService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Renderer2,
          useValue: {
              createElement: () => new SVGPolylineElement(),
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
            },
        },
      ],
    });
    line = getTestBed().get(LineService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>)
    line.initialize(manipulator, image, getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>));
  });

  it('should be created', () => {
    // const service: LineService = TestBed.get(LineService);
    expect(line).toBeTruthy();
  });

  it('should get name', () => {
    expect(LineService.getName()).toEqual(Tools.Line);
  });

  it('should set default properties', () => {
    const properties = new DrawablePropertiesService();
    line.initializeProperties();
    expect(line.thickness).toEqual(properties.thickness.value);
    expect(line.dotDiameter).toEqual(properties.dotDiameter.value);
    expect(line.jointIsDot).toEqual(properties.junction.value);
  });

  it('should initialize subscriptions', () => {
    const properties = new DrawablePropertiesService();
    const randomTestValue = 10;
    line.initializeProperties();
    properties.thickness.next(randomTestValue);
    properties.dotDiameter.next(randomTestValue);
    expect(line.thickness).toEqual(randomTestValue);
    expect(line.dotDiameter).toEqual(randomTestValue);
  });

  it('should add point to line with shift pressed', () => {
    const point = new CoordinatesXY(1,1);
    const spy = spyOn<CoordinatesXY>(point, "getClosestPoint");
    line.addPointToLine(point.getX(), point.getY());
    line.onKeyPressed(new KeyboardEvent('keydown', {shiftKey: true}));
    line.addPointToLine(2,2);
    expect(spy).toHaveBeenCalled();
  });

  it('should add point to line without shift pressed', () => {
    const point = new CoordinatesXY(1,1);
    const spy = spyOn<CoordinatesXY>(point, "getClosestPoint");
    line.addPointToLine(point.getX(), point.getY());
    line.onKeyReleased(new KeyboardEvent('keyup', {shiftKey: false}));
    line.addPointToLine(2,2);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should remove last point', () => {
    line.addPointToLine(1,1);
    let hasChanged = false;
    manipulator.listen(image, 'change', () => {
      hasChanged = true;
    });
    line.removeLastPoint();
    expect(hasChanged).toBe(true);
  });

  // it('should set shiftpressed attribute', () => {
  //   const shiftPressed = new KeyboardEvent("keypress",{
  //     "key": "Shift"
  //   });
  //   line.onKeyPressed(shiftPressed);
  //   const spy = spy<any>(line, 'shiftPressed');
  //   expect(spy).toHaveBeenCalled();
  // });
});
