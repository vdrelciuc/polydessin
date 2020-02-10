import { getTestBed, TestBed } from '@angular/core/testing';

import { ElementRef, Renderer2, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
import { BrushService } from './brush.service';

describe('BrushService', () => {
  let service: BrushService;
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
    service = getTestBed().get(BrushService);
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

  it('#getThickness should get integer', () => {
    service['thickness'] = 3.49;
    expect(service.getThickness()).toEqual(3);
  });

  it('#onMouseInCanvas should set preview and create circle', () => {
    const spy = spyOn(manipulator, 'appendChild');
    const spy2 = spyOn(manipulator, 'createElement');
    service.onMouseInCanvas(eventMocker('mousemove', 0));
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('#onMouseInCanvas should set preview', () => {
    service.onMouseInCanvas(eventMocker('mousemove', 0));
    const spy = spyOn(manipulator, 'appendChild');
    service.onMouseInCanvas(eventMocker('mousemove', 0));
    expect(spy).toHaveBeenCalled();
    expect(service['previewCricle']).toBeTruthy();
  });

  it('#onMouseOutCanvas should remove mousepointer preview', () => {
    const spy = spyOn(manipulator, 'removeChild');
    service.onMouseOutCanvas(eventMocker('mousemove', 0));
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseOutCanvas should stop drawing', () => {
    service['isDrawing'] = true;
    const spy = spyOn(manipulator, 'appendChild');
    service.onMouseOutCanvas(eventMocker('mousemove', 0));
    expect(service['isDrawing']).not.toBeTruthy();
    expect(spy).toHaveBeenCalled();
    expect(service['previousX']).toEqual(10);
    expect(service['previousY']).toEqual(10);
  });

  it('#onMousePress should init elements', () => {
    const spy = spyOn(manipulator, 'removeChild');
    service.onMousePress(eventMocker('mousemove', 0));
    expect(service['previousX']).toEqual(10);
    expect(service['previousY']).toEqual(10);
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseRelease shouldn\'t stop drawing, left not released', () => {
    service['isDrawing'] = true;
    service.onMouseRelease(eventMocker('mouseup', 1));
    expect(service['isDrawing']).toBeTruthy();
  });

  it('#onMouseRelease should stop drawing, left released', () => {
    const spy = spyOn(service, 'updateCursor');
    service['isDrawing'] = false;
    service.onMouseRelease(eventMocker('mouseup', 0));
    expect(service['isDrawing']).not.toBeTruthy();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#onMouseRelease should stop drawing', () => {
    const spy = spyOn(service, 'updateCursor');
    service['isDrawing'] = true;
    service.onMouseRelease(eventMocker('mouseup', 0));
    expect(service['isDrawing']).not.toBeTruthy();
    expect(spy).toHaveBeenCalledWith(10, 10);
  });

  it('#onMouseMove should update cursor', () => {
    const spy = spyOn(service, 'updateCursor');
    service['isDrawing'] = false;
    service.onMouseMove(eventMocker('mouseup', 0));
    expect(spy).toHaveBeenCalledWith(10, 10);
  });

  it('#onMouseMove should update cursor', () => {
    service['isDrawing'] = true;
    service.onMouseMove(eventMocker('mouseup', 0));
    expect(service['previousX']).toEqual(10);
    expect(service['previousY']).toEqual(10);
  });

  it('#onClick should stop drawing', () => {
    service.onClick(eventMocker('click', 0));
    expect(service['isDrawing']).not.toBeTruthy();
  });

  it('#updateCursor should update cursor attributes', () => {
    const spy = spyOn(manipulator, 'setAttribute');
    service.updateCursor(10, 10);
    expect(spy).toHaveBeenCalledTimes(3);
  });
});
