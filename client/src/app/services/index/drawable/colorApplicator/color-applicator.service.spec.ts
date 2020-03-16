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

fdescribe('ColorApplicatorService', () => {
  let service: ColorApplicatorService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;
  const colorSubject =  new BehaviorSubject<Color>(new Color('#FFFFFF'));
  const opacitySubject = new BehaviorSubject<number>(1);

  const LEFT_CLICK = 0;
  //const RIGHT_CLICK = 2;
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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#onClick should set new fill color of rectangle on left click if fill is not none', () => {
    //mockedTagElement = SVGProperties.rectangle;
    mockedFillAttribute = (new Color()).getHex();
    mockedEvent = eventMocker('click', LEFT_CLICK, 0, 0);
    // Overriding target property
    Object.defineProperty(mockedEvent, 'target', {value: document.createElementNS('http://www.w3.org/2000/svg', 'rect'), enumerable: true});
    console.log(mockedEvent.target as SVGElement);
    console.log((mockedEvent.target as SVGElement).tagName);

    //(mockedEvent.target as SVGElement).tagName = jasmine.createSpy().and.returnValue(mockedTagElement);
    //const spy = spyOnProperty<any>(mockedEvent, 'target')//.and.returnValue(document.createElementNS('http://www.w3.org/2000/svg', 'rect'));
    (mockedEvent.target as SVGElement).getAttribute = jasmine.createSpy().and.returnValue(mockedFillAttribute);
    const shapeChangeSpy = spyOn<any>(service, 'onLeftClick');
    service.onMouseMove(mockedEvent);
    //service['shapeChange'](mockedEvent.target as SVGElement, '', '', true);
    console.log(service['test']);
    expect(shapeChangeSpy).toHaveBeenCalledTimes(2);
    //expect(spy).toHaveBeenCalledTimes(2);
  });


});
