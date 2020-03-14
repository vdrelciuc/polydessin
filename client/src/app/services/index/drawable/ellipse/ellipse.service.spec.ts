import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';
import * as CONSTANT from 'src/app/classes/constants';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { EllipseService } from './ellipse.service';
// tslint:disable: no-magic-numbers no-any
describe('EllipseService', () => {

  let service: EllipseService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;
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
      ],
    });
    service = getTestBed().get(EllipseService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>);
    service['mousePosition'] = new CoordinatesXY(10, 10);
    service['shapeStyle'].fillOpacity = 0.5;
    service['shapeStyle'].thickness = 5;
    service.attributes = new DrawablePropertiesService();
    service.initialize(manipulator, image,
      getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>),
      getTestBed().get(DrawStackService)
    );

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#constructor should set the EllipseService with its correct default attributes', () => {
    expect(service.frenchName).toBe('Ellipse');
    expect(service.shapeStyle.thickness).toBe(CONSTANT.THICKNESS_DEFAULT);
    expect(service.shapeStyle.fillColor.getHex()).toBe(CONSTANT.COLOR_DEFAULT);
    expect(service.shapeStyle.borderColor.getHex()).toBe(CONSTANT.COLOR_DEFAULT);
    expect(service.shapeStyle.hasBorder).toBe(true);
    expect(service.shapeStyle.hasFill).toBe(true);
    expect(service.shapeStyle.nameDisplayDefault).toBe('[Ellipse]');
    expect(service.shapeStyle.nameDisplayOnShift).toBe('[Cercle]');
  });

  it('#onMouseMove should call setDimensionsAttributes', () => {
    service.colorSelectorService.backgroundColor = new BehaviorSubject<Color>(new Color('ffffff'));
    service.onMousePress(eventMocker('', 0, 0, 0));
    console.log(service['drawOnNextMove']);

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

});
