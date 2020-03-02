import { TestBed, getTestBed } from '@angular/core/testing';
import * as CONSTANT from 'src/app/classes/constants';
import { EllipseService } from './ellipse.service';
import { ElementRef, Renderer2, Type } from '@angular/core';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';

describe('EllipseService', () => {

  let service: EllipseService;
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
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>)
    service['mousePosition'] = new CoordinatesXY(10, 10);
    service['shapeStyle'].fillOpacity = 0.5;
    service['shapeStyle'].thickness = 5;
    service.attributes = new DrawablePropertiesService();
    service.initialize(manipulator, image, getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>));
  });

  it('should be created', () => {
    const service: EllipseService = TestBed.get(EllipseService);
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
  /*
  it('#onMouseMove should call setDimensionsAttributes', () => {
    service['isChanging'] = true;
    const spy = spyOn(service as any, 'setDimensionsAttributes');
    service.onMouseMove(new MouseEvent('mousemove', {clientX: 100, clientY: 100}));
    expect(spy).toHaveBeenCalled();
  });*/
  
});
