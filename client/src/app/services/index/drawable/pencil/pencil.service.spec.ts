import { TestBed, getTestBed } from '@angular/core/testing';

import { PencilService } from './pencil.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { Renderer2, ElementRef, Type } from '@angular/core';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { Color } from 'src/app/classes/color';
import { BehaviorSubject } from 'rxjs';

describe('PencilService', () => {
  let service: PencilService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;
  const colorSubject =  new BehaviorSubject<Color>(new Color('#FFFFFF'));
  const bla = (parentElement: any, name: string, debugInfo?: any): Element => {
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
              createElement: () => bla,
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
          },
        },
      ],
    });
    service = getTestBed().get(PencilService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>)
    service.attributes = new DrawablePropertiesService();
    service.initialize(manipulator, image, getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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

  it('#onMouseInCanvas should create circle', () => {
    const spy = spyOn(manipulator, 'createElement');
    const spyAttributes = spyOn(manipulator, 'setAttribute');
    service.onMouseInCanvas(eventMocker('mousemove', 0));
    expect(spy).toHaveBeenCalled();
    expect(spyAttributes).toHaveBeenCalledTimes(5);
  });

  it('#onMouseInCanvas shouldn\'t create circle', () => {
    service.onMouseInCanvas((eventMocker('mouseup', 0)));
    const spy = spyOn(manipulator, 'createElement');
    const spyAttributes = spyOn(manipulator, 'setAttribute');
    service.onMouseInCanvas(eventMocker('mouseup', 0));
    expect(spy).not.toHaveBeenCalled();
    expect(spyAttributes).toHaveBeenCalledTimes(1);
  });

  it('#onMouseOutCanvas should remove mouse pointer', () => {
    const spy = spyOn(manipulator, 'removeChild');
    service.onMouseOutCanvas(eventMocker('mouseup', 0));
    expect(spy).toHaveBeenCalled();
  });

  it('#onMousePress should remove mouse pointer', () => {
    const spy = spyOn(manipulator, 'setAttribute');

    service.onMousePress(eventMocker('mousepress', 0));
    expect(spy).toHaveBeenCalledTimes(7);
    expect(service['previousX']).toEqual(10);
    expect(service['previousY']).toEqual(10);
  });

  it('#onMouseRelease should stop drawing with l', () => {
    service.isDrawing = true;
    service.onMouseRelease(eventMocker('mouserelease', 0));
    expect(service.isDrawing).not.toBeTruthy();
  });

  it('#onMouseRelease should stop drawing without l', () => {
    service.isDrawing = true;
    service['path'] = 'M 475,299';
    const spy1 = spyOn(manipulator, 'removeChild');
    const spy2 = spyOn(manipulator, 'appendChild');
    service.onMouseRelease(eventMocker('mouserelease', 0));
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledTimes(2);
  });

  it('#onMouseRelease shouldn\'t stop drawing', () => {
    service.isDrawing = true;
    service.onMouseRelease(eventMocker('mouserelease', 1))
    expect(service.isDrawing).toBeTruthy();
  });

  it('#onMouseMove should update path, user is drawing', () => {
    service.isDrawing = true;
    service.onMouseMove(eventMocker('mousemouve', 0));
    expect(service['previousX']).toEqual(10);
    expect(service['previousY']).toEqual(10);
  });

  it('#onMouseMove should update mousepointer, user is previewing', () => {
    service.isDrawing = false;
    const spy = spyOn(manipulator, 'setAttribute');
    service.onMouseMove(eventMocker('mousemouve', 0));
    expect(service['previousX']).not.toBeDefined();
    expect(service['previousY']).not.toBeDefined();
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
