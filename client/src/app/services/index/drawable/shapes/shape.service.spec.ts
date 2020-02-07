import { TestBed, getTestBed } from '@angular/core/testing';

import { RectangleService } from '../rectangle/rectangle.service';
import { Renderer2, ElementRef, Type } from '@angular/core';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';

describe('ShapeService', () => {
  
  let service: RectangleService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;
  const colorSubject =  new BehaviorSubject<Color>(new Color('#FFFFFF'));
  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  }

  const eventMocker = (event: string, keyUsed: number) => 
      new MouseEvent(event, {button: keyUsed, clientX: 10, clientY: 10});


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Renderer2,
          useValue: {
              createElement: () => mockedRendered,
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
            primaryColor: colorSubject,
            primaryTransparency: new BehaviorSubject<number>(3)
          },
        },
      ],
    });
    service = getTestBed().get(RectangleService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>);
    service.attributes = new DrawablePropertiesService();
    service.initialize(manipulator, image, 
      getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#initializeProperties should set default properties', () => {
    const properties = new DrawablePropertiesService();
    service.initializeProperties();
    expect(service.shapeStyle.fillColor.getHex()).toBe(properties.fillColor.value);
    expect(service.shapeStyle.borderColor.getHex()).toBe(properties.color.value);
  });

  it('#initializeProperties should define subscriptions', () => {
    const properties = new DrawablePropertiesService();
    const newColor = "#ABCDEF";
    service.initializeProperties();
    properties.fillColor.next(newColor);
    properties.color.next(newColor);
    expect(service.shapeStyle.fillColor.getHex()).toBe(newColor);
    expect(service.shapeStyle.borderColor.getHex()).toBe(newColor);
  });

  it('#onMousePress should release mouse out of canvas', () => {
    service['isChanging'] = true;
    const spy = spyOn(service, 'onMouseRelease');
    const spy2 = spyOn(manipulator, 'removeChild');
    service.onMousePress(eventMocker('mouseup', 0));
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(service['isChanging']).not.toBeTruthy();
  });

  it('#onMousePress should release mouse out of canvas', () => {
    // test
  });

  it('#onMouseRelease should stop shape', () => {
    service['drawOnNextMove'] = true;
    service.onMouseRelease(eventMocker('mouserelease', 0));
    expect(service['drawOnNextMove']).not.toBeTruthy();
  });

  it('#onMouseMove should release mouse out of canvas', () => {
    // test
  });

});
