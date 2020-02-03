import { TestBed, getTestBed } from '@angular/core/testing';

import { RectangleService } from './rectangle.service';
import { Renderer2, ElementRef, Type } from '@angular/core';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import * as CONSTANT from 'src/app/classes/constants';

describe('RectangleService', () => {

  let rectangleService: RectangleService;
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
    rectangleService = getTestBed().get(RectangleService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>)
    rectangleService.initialize(manipulator, image);
  });

  it('should be created', () => {
    expect(rectangleService).toBeTruthy();
  });

  it('#constructer should set the RectangleService with its correct default attributes', () => {
    expect(rectangleService.frenchName).toBe("Rectangle");
    expect(rectangleService.shapeStyle.thickness).toBe(CONSTANT.THICKNESS_DEFAULT);
    expect(rectangleService.shapeStyle.fillColor.getHex()).toBe(CONSTANT.COLOR_DEFAULT);
    expect(rectangleService.shapeStyle.borderColor.getHex()).toBe(CONSTANT.COLOR_DEFAULT);
    expect(rectangleService.shapeStyle.opacity).toBe(CONSTANT.OPACITY_DEFAULT);
    expect(rectangleService.shapeStyle.hasBorder).toBe(true);
    expect(rectangleService.shapeStyle.nameDisplayDefault).toBe('[Rectangle]');
    expect(rectangleService.shapeStyle.nameDisplayOnShift).toBe('[Carré]');
  })

  it('#initializeProperties should set default properties', () => {
    const properties = new DrawablePropertiesService();
    rectangleService.initializeProperties(properties);
    expect(rectangleService.shapeStyle.fillColor.getHex()).toBe(properties.fillColor.value);
    expect(rectangleService.shapeStyle.borderColor.getHex()).toBe(properties.color.value);
  });

  it('#initializeProperties should define subscriptions', () => {
    const properties = new DrawablePropertiesService();
    const newColor = "#ABCDEF";
    rectangleService.initializeProperties(properties);
    properties.fillColor.next(newColor);
    properties.color.next(newColor);
    expect(rectangleService.shapeStyle.fillColor.getHex()).toBe(newColor);
    expect(rectangleService.shapeStyle.borderColor.getHex()).toBe(newColor);
  });

});
