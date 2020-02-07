import { TestBed, getTestBed } from '@angular/core/testing';

import { RectangleService } from './rectangle.service';
import { Renderer2, ElementRef, Type } from '@angular/core';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import * as CONSTANT from 'src/app/classes/constants';
import { ColorSelectorService } from 'src/app/services/color-selector.service';

describe('RectangleService', () => {

  let rectangleService: RectangleService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;

  // Faking a MouseEvent
  let e = {
    type: 'click',
    bubbles: true,
    cancelable: true,
    view: window,
    detail: 0,
    screenX: 1,
    screenY: 1,
    clientX: 1,
    clientY: 1,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    button: 0,
    relatedTarget: undefined,
  };

  let evt = document.createEvent('MouseEvents');
  evt.initMouseEvent(
    e.type,
    e.bubbles,
    e.cancelable,
    e.view,
    e.detail,
    e.screenX,
    e.screenY,
    e.clientX,
    e.clientY,
    e.ctrlKey,
    e.altKey,
    e.shiftKey,
    e.metaKey,
    e.button,
    document.body.parentNode
  );

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
        {
          provide: ColorSelectorService,
          useValue: {
            },
        },
      ],
    });
    rectangleService = getTestBed().get(RectangleService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>);
    rectangleService.initialize(manipulator, image, 
        getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>));
  });

  it('should be created', () => {
    expect(rectangleService).toBeTruthy();
  });

  it('#constructer should set the RectangleService with its correct default attributes', () => {
    expect(rectangleService.frenchName).toBe("Rectangle");
    expect(rectangleService.shapeStyle.thickness).toBe(CONSTANT.THICKNESS_DEFAULT);
    expect(rectangleService.shapeStyle.fillColor.getHex()).toBe(CONSTANT.COLOR_DEFAULT);
    expect(rectangleService.shapeStyle.borderColor.getHex()).toBe(CONSTANT.COLOR_DEFAULT);
    // expect(rectangleService.shapeStyle.opacity).toBe(CONSTANT.OPACITY_DEFAULT);
    expect(rectangleService.shapeStyle.hasBorder).toBe(true);
    expect(rectangleService.shapeStyle.nameDisplayDefault).toBe('[Rectangle]');
    expect(rectangleService.shapeStyle.nameDisplayOnShift).toBe('[Carré]');
  });

  it('#initializeProperties should set default properties', () => {
    const properties = new DrawablePropertiesService();
    rectangleService.initializeProperties();
    expect(rectangleService.shapeStyle.fillColor.getHex()).toBe(properties.fillColor.value);
    expect(rectangleService.shapeStyle.borderColor.getHex()).toBe(properties.color.value);
  });

  it('#initializeProperties should define subscriptions', () => {
    const properties = new DrawablePropertiesService();
    const newColor = "#ABCDEF";
    rectangleService.initializeProperties();
    properties.fillColor.next(newColor);
    properties.color.next(newColor);
    expect(rectangleService.shapeStyle.fillColor.getHex()).toBe(newColor);
    expect(rectangleService.shapeStyle.borderColor.getHex()).toBe(newColor);
  });

});
