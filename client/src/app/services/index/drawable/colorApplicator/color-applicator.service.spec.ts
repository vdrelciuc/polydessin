import { TestBed, getTestBed } from '@angular/core/testing';

import { ColorApplicatorService } from './color-applicator.service';
import { Renderer2, ElementRef, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';
//import * as CONSTANT from 'src/app/classes/constants';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { DrawablePropertiesService } from '../properties/drawable-properties.service';
//import { SVGProperties } from 'src/app/classes/svg-html-properties';

describe('ColorApplicatorService', () => {
  let service: ColorApplicatorService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;
  const colorSubject =  new BehaviorSubject<Color>(new Color('#FFFFFF'));
  const opacitySubject = new BehaviorSubject<number>(1);

  const LEFT_CLICK = 0;
  const RIGHT_CLICK = 2;
  //let mockedTagElement: string;
  let mockedFillAttribute: string;
  let mockedEvent: MouseEvent;

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
            },
          },
        },
        {
          provide: ColorSelectorService,
          useValue: {
            primaryColor: colorSubject,
            secondaryColor: colorSubject,
            backgroundColor: colorSubject,
            primaryTransparency: opacitySubject,
            secondaryTransparency: opacitySubject
          },
        },
        DrawStackService
      ],
    });
    service = getTestBed().get(ColorApplicatorService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>);
    service['attributes'] = new DrawablePropertiesService();
    service.initialize(manipulator, image,
      getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>),
      getTestBed().get<DrawStackService>(DrawStackService as Type<DrawStackService>));
    
    service['image'].nativeElement.cloneNode = jasmine.createSpy().and.returnValue(undefined);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#onClick should set new fill color of rectangle on left click if fill is not none', () => {
    mockedFillAttribute = (new Color()).getHex();
    mockedEvent = eventMocker('click', LEFT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: document.createElementNS('http://www.w3.org/2000/svg', 'rect') });

    spyOn<any>((mockedEvent.target as SVGElement), 'getAttribute').and.returnValue(mockedFillAttribute);
    const leftClickSpy = spyOn<any>(service, 'onLeftClick').and.callThrough();
    const shapeChangeSpy = spyOn<any>(service, 'shapeChange').and.callThrough();
    
    service.onClick(mockedEvent);

    expect(leftClickSpy).toHaveBeenCalled();
    expect(shapeChangeSpy).toHaveBeenCalledTimes(1);
  });

  it('#onClick should set new fill color of ellipse on left click if fill is not none', () => {
    mockedFillAttribute = (new Color()).getHex();
    mockedEvent = eventMocker('click', LEFT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: document.createElementNS('http://www.w3.org/2000/svg', 'ellipse') });

    spyOn<any>((mockedEvent.target as SVGElement), 'getAttribute').and.returnValue(mockedFillAttribute);
    const leftClickSpy = spyOn<any>(service, 'onLeftClick').and.callThrough();
    const shapeChangeSpy = spyOn<any>(service, 'shapeChange').and.callThrough();
    
    service.onClick(mockedEvent);

    expect(leftClickSpy).toHaveBeenCalled();
    expect(shapeChangeSpy).toHaveBeenCalledTimes(1);
  });

  it('#onClick should set new fill color of polygon on left click if fill is not none', () => {
    mockedFillAttribute = (new Color()).getHex();
    mockedEvent = eventMocker('click', LEFT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: document.createElementNS('http://www.w3.org/2000/svg', 'polygon') });

    spyOn<any>((mockedEvent.target as SVGElement), 'getAttribute').and.returnValue(mockedFillAttribute);
    const leftClickSpy = spyOn<any>(service, 'onLeftClick').and.callThrough();
    const shapeChangeSpy = spyOn<any>(service, 'shapeChange').and.callThrough();
    
    service.onClick(mockedEvent);

    expect(leftClickSpy).toHaveBeenCalled();
    expect(shapeChangeSpy).toHaveBeenCalledTimes(1);
  });

  it('#onClick should not set new fill color of rectangle on left click if fill is none', () => {
    mockedFillAttribute = 'none';
    mockedEvent = eventMocker('click', LEFT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: document.createElementNS('http://www.w3.org/2000/svg', 'rect') });

    spyOn<any>((mockedEvent.target as SVGElement), 'getAttribute').and.returnValue(mockedFillAttribute);
    const leftClickSpy = spyOn<any>(service, 'onLeftClick').and.callThrough();
    const shapeChangeSpy = spyOn<any>(service, 'shapeChange').and.callThrough();
    
    service.onClick(mockedEvent);

    expect(leftClickSpy).toHaveBeenCalled();
    expect(shapeChangeSpy).not.toHaveBeenCalled();
  });

  it('#onClick should not set new fill color of ellipse on left click if fill is none', () => {
    mockedFillAttribute = 'none';
    mockedEvent = eventMocker('click', LEFT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: document.createElementNS('http://www.w3.org/2000/svg', 'ellipse') });

    spyOn<any>((mockedEvent.target as SVGElement), 'getAttribute').and.returnValue(mockedFillAttribute);
    const leftClickSpy = spyOn<any>(service, 'onLeftClick').and.callThrough();
    const shapeChangeSpy = spyOn<any>(service, 'shapeChange').and.callThrough();
    
    service.onClick(mockedEvent);

    expect(leftClickSpy).toHaveBeenCalled();
    expect(shapeChangeSpy).not.toHaveBeenCalled();
  });

  it('#onClick should not set new fill color of polygon on left click if fill is none', () => {
    mockedFillAttribute = 'none';
    mockedEvent = eventMocker('click', LEFT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: document.createElementNS('http://www.w3.org/2000/svg', 'polygon') });

    spyOn<any>((mockedEvent.target as SVGElement), 'getAttribute').and.returnValue(mockedFillAttribute);
    const leftClickSpy = spyOn<any>(service, 'onLeftClick').and.callThrough();
    const shapeChangeSpy = spyOn<any>(service, 'shapeChange').and.callThrough();
    
    service.onClick(mockedEvent);

    expect(leftClickSpy).toHaveBeenCalled();
    expect(shapeChangeSpy).not.toHaveBeenCalled();
  });

  it('#onClick should set new border color of rectangle on right click', () => {
    mockedEvent = eventMocker('click', RIGHT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: document.createElementNS('http://www.w3.org/2000/svg', 'rect') });

    const rightClickSpy = spyOn<any>(service, 'onRightClick').and.callThrough();
    const shapeChangeSpy = spyOn<any>(service, 'shapeChange').and.callThrough();
    
    service.onClick(mockedEvent);

    expect(rightClickSpy).toHaveBeenCalled();
    expect(shapeChangeSpy).toHaveBeenCalledTimes(1);
  });

  it('#onClick should set new border color of ellipse on right click', () => {
    mockedEvent = eventMocker('click', RIGHT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: document.createElementNS('http://www.w3.org/2000/svg', 'ellipse') });

    const rightClickSpy = spyOn<any>(service, 'onRightClick').and.callThrough();
    const shapeChangeSpy = spyOn<any>(service, 'shapeChange').and.callThrough();
    
    service.onClick(mockedEvent);

    expect(rightClickSpy).toHaveBeenCalled();
    expect(shapeChangeSpy).toHaveBeenCalledTimes(1);
  });

  it('#onClick should set new border color of polygon on right click', () => {
    mockedEvent = eventMocker('click', RIGHT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: document.createElementNS('http://www.w3.org/2000/svg', 'polygon') });

    const rightClickSpy = spyOn<any>(service, 'onRightClick').and.callThrough();
    const shapeChangeSpy = spyOn<any>(service, 'shapeChange').and.callThrough();
    
    service.onClick(mockedEvent);

    expect(rightClickSpy).toHaveBeenCalled();
    expect(shapeChangeSpy).toHaveBeenCalledTimes(1);
  });

  it('#onClick should set new border color of path on left click', () => {
    mockedFillAttribute = 'none';
    mockedEvent = eventMocker('click', LEFT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: document.createElementNS('http://www.w3.org/2000/svg', 'path') });

    spyOn<any>((mockedEvent.target as SVGElement), 'getAttribute').and.returnValue(mockedFillAttribute);
    const leftClickSpy = spyOn<any>(service, 'onLeftClick').and.callThrough();
    const pathChangeSpy = spyOn<any>(service, 'pathChange').and.callThrough();
    
    service.onClick(mockedEvent);

    expect(leftClickSpy).toHaveBeenCalled();
    expect(pathChangeSpy).toHaveBeenCalled();
  });

  it('#onClick should not set new border color of path on right click', () => {
    mockedEvent = eventMocker('click', RIGHT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: document.createElementNS('http://www.w3.org/2000/svg', 'path') });

    const rightClickSpy = spyOn<any>(service, 'onRightClick').and.callThrough();
    const pathChangeSpy = spyOn<any>(service, 'pathChange').and.callThrough();
    
    service.onClick(mockedEvent);

    expect(rightClickSpy).toHaveBeenCalled();
    expect(pathChangeSpy).not.toHaveBeenCalled();
  });

  it('#onClick should set new border color of line on left click', () => {
    mockedFillAttribute = 'none';
    mockedEvent = eventMocker('click', LEFT_CLICK, 0, 0);
    const gElelemt = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const polylineElement = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    const circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    gElelemt.appendChild(polylineElement);
    gElelemt.appendChild(circleElement);
    
    Object.defineProperty(mockedEvent, 'target', { value: polylineElement });

    spyOn<any>((mockedEvent.target as SVGElement), 'getAttribute').and.returnValue(mockedFillAttribute);
    const leftClickSpy = spyOn<any>(service, 'onLeftClick').and.callThrough();
    const pathChangeSpy = spyOn<any>(service, 'pathChange').and.callThrough();
    const shapeChangeSpy = spyOn<any>(service, 'shapeChange').and.callThrough();
    
    service.onClick(mockedEvent);

    expect(leftClickSpy).toHaveBeenCalled();
    expect(pathChangeSpy).toHaveBeenCalledTimes(1);
    expect(shapeChangeSpy).toHaveBeenCalledTimes(2);
  });

  it('#onClick should not set new border color of line on right click', () => {
    mockedEvent = eventMocker('click', RIGHT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: document.createElementNS('http://www.w3.org/2000/svg', 'polyline') });

    const rightClickSpy = spyOn<any>(service, 'onRightClick').and.callThrough();
    const pathChangeSpy = spyOn<any>(service, 'pathChange').and.callThrough();
    
    service.onClick(mockedEvent);

    expect(rightClickSpy).toHaveBeenCalled();
    expect(pathChangeSpy).not.toHaveBeenCalled();
  });

  it('#onClick should set new fill color of spray on left click', () => {
    mockedFillAttribute = 'none';
    mockedEvent = eventMocker('click', LEFT_CLICK, 0, 0);
    const gElelemt = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const circle1Element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const circle2Element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    gElelemt.appendChild(circle1Element);
    gElelemt.appendChild(circle2Element);
    
    Object.defineProperty(mockedEvent, 'target', { value: circle1Element });

    spyOn<any>((mockedEvent.target as SVGElement), 'getAttribute').and.returnValue(mockedFillAttribute);
    const leftClickSpy = spyOn<any>(service, 'onLeftClick').and.callThrough();
    const pathChangeSpy = spyOn<any>(service, 'pathChange').and.callThrough();
    const shapeChangeSpy = spyOn<any>(service, 'shapeChange').and.callThrough();
    
    service.onClick(mockedEvent);

    expect(leftClickSpy).toHaveBeenCalled();
    expect(pathChangeSpy).not.toHaveBeenCalled();
    expect(shapeChangeSpy).toHaveBeenCalledTimes(4);
  });

  it('#onClick should not set new fill color of spray on right click', () => {
    mockedEvent = eventMocker('click', RIGHT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: document.createElementNS('http://www.w3.org/2000/svg', 'circle') });

    const rightClickSpy = spyOn<any>(service, 'onRightClick').and.callThrough();
    const pathChangeSpy = spyOn<any>(service, 'pathChange').and.callThrough();
    
    service.onClick(mockedEvent);

    expect(rightClickSpy).toHaveBeenCalled();
    expect(pathChangeSpy).not.toHaveBeenCalled();
  });

  it('#onClick should not do anything if button is not left or right click', () => {
    mockedEvent = eventMocker('click', 1, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: document.createElementNS('http://www.w3.org/2000/svg', 'circle') });

    const leftClickSpy = spyOn<any>(service, 'onLeftClick');
    const rightClickSpy = spyOn<any>(service, 'onRightClick');
    
    service.onClick(mockedEvent);

    expect(leftClickSpy).not.toHaveBeenCalled();
    expect(rightClickSpy).not.toHaveBeenCalled();
  });

  it('#onClick should not do anything if the clicked element is the SVG', () => {
    mockedEvent = eventMocker('click', RIGHT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: document.createElementNS('http://www.w3.org/2000/svg', 'svg') });

    const pathChangeSpy = spyOn<any>(service, 'pathChange');
    const shapeChangeSpy = spyOn<any>(service, 'shapeChange');
    
    service.onClick(mockedEvent);

    expect(pathChangeSpy).not.toHaveBeenCalled();
    expect(shapeChangeSpy).not.toHaveBeenCalled();
  });
});
