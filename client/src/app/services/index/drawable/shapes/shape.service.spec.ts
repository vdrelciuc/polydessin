import { TestBed, getTestBed } from '@angular/core/testing';

import { ShapeService } from './shape.service';
import { RectangleService } from '../rectangle/rectangle.service';
import { Renderer2, ElementRef, Type } from '@angular/core';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';

describe('ShapeService', () => {
  
  let shapeService: RectangleService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Renderer2,
          useValue: {
            createElement: () => new SVGElement(),
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
      ],
    });
    shapeService = getTestBed().get(RectangleService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>)
    shapeService.initialize(manipulator, image);
  });

  it('should be created', () => {
    const service: ShapeService = TestBed.get(ShapeService);
    expect(service).toBeTruthy();
  });

  it('#initializeProperties should set default properties', () => {
    const properties = new DrawablePropertiesService();
    shapeService.initializeProperties(properties);
    expect(shapeService.shapeStyle.fillColor.getHex()).toBe(properties.fillColor.value);
    expect(shapeService.shapeStyle.borderColor.getHex()).toBe(properties.color.value);
  });

  it('#initializeProperties should define subscriptions', () => {
    const properties = new DrawablePropertiesService();
    const newColor = "#ABCDEF";
    shapeService.initializeProperties(properties);
    properties.fillColor.next(newColor);
    properties.color.next(newColor);
    expect(shapeService.shapeStyle.fillColor.getHex()).toBe(newColor);
    expect(shapeService.shapeStyle.borderColor.getHex()).toBe(newColor);
  });
});
