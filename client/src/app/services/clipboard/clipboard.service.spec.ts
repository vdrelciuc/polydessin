// tslint:disable: no-magic-numbers | Reason: arbitrary values used for testing purposes
import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Stack } from 'src/app/classes/stack';
import { Transform } from 'src/app/classes/transformations';
import { ClipboardService } from './clipboard.service';

describe('ClipboardService', () => {
  let service: ClipboardService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;

  // tslint:disable-next-line: no-any | Defining parentElement as an ElementRef throws an exception
  const mockedRendered = (parentElement: any, name: string, debugInfo?: string): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  };

  const mockedElementBBox = (): DOMRect => {
    return {
        x: 99,
        y: 99,
        width: 10,
        height: 10,
        top: 99,
        left: 99,
        right: 109,
        bottom: 109,
        toJSON: () =>  null
    };
  };

  const mockedSVGBBox = (): DOMRect => {
    return {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        top: 0,
        left: 0,
        right: 100,
        bottom: 100,
        toJSON: () =>  null
    };
  };

  const addElementToSelection = (): void => {
    const element: SVGGElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    Transform.elementsToTransform.push(element);
  };

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
            getAttribute: () => null
        },
      },
      {
        provide: ElementRef,
        useValue: {
            nativeElement: {
              getAttribute: () => null,
              childNodes: [
                {
                  getBoundingClientRect: () => ({
                    left: 100,
                    right: 100,
                    top: 100,
                    bottom: 100
                  }),
                  getAttribute: () => null
                }
              ]
            }
          },
        },
        Transform
      ],
    });
    service = getTestBed().get(ClipboardService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>);
    ClipboardService['selectedElements'] = new Stack<SVGGElement>();
    ClipboardService['copyTop'] = 0;
    ClipboardService['copyLeft'] = 0;
    Transform.elementsToTransform = [];

    image.nativeElement.cloneNode = jasmine.createSpy().and.returnValue(undefined);
    image.nativeElement.getBoundingClientRect = jasmine.createSpy().and.callFake(mockedSVGBBox);

    ClipboardService.initialize(manipulator, image);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#initialize should initialize class attributes', () => {
    expect(ClipboardService['manipulator']).toBeDefined();
    expect(ClipboardService['image']).toBeDefined();
  });

  it('#pasteDisabled should return true when no element has been copied', () => {
    expect(ClipboardService.pasteDisabled()).toBe(true);
  });

  it('#pasteDisabled should return false when elements has been copied', () => {
    addElementToSelection();
    ClipboardService.copy();
    expect(ClipboardService.pasteDisabled()).toBe(false);
  });

  it('#cut should save elements in clipboard and delete selection', () => {
    addElementToSelection();
    const spy = spyOn(Transform, 'delete');
    expect(ClipboardService['selectedElements'].size()).toBe(0);
    ClipboardService.cut();
    expect(ClipboardService['selectedElements'].size()).toBe(1);
    expect(spy).toHaveBeenCalled();
  });

  it('#copy should save elements in clipboard', () => {
    addElementToSelection();
    expect(ClipboardService['selectedElements'].size()).toBe(0);
    ClipboardService.copy();
    expect(ClipboardService['selectedElements'].size()).toBe(1);
  });

  it('#copy should reset shift for pasting elements to 5px', () => {
    addElementToSelection();
    ClipboardService.copy();
    expect(ClipboardService['currentShift']).toBe(5);
    ClipboardService.paste();
    expect(ClipboardService['currentShift']).toBe(10);
    ClipboardService.paste();
    expect(ClipboardService['currentShift']).toBe(15);
    ClipboardService.paste();
    expect(ClipboardService['currentShift']).toBe(20);
    ClipboardService.copy();
    expect(ClipboardService['currentShift']).toBe(5);
  });

  it('#paste should add elements from clipboard to SVG', () => {
    addElementToSelection();
    ClipboardService.copy();
    const spy = spyOn(manipulator, 'appendChild');
    ClipboardService.paste();
    expect(spy).toHaveBeenCalled();
  });

  it('#paste should shift elements by 5px if paste is repeated', () => {
    addElementToSelection();
    ClipboardService.copy();
    expect(ClipboardService['currentShift']).toBe(5);
    ClipboardService.paste();
    expect(ClipboardService['currentShift']).toBe(10);
    ClipboardService.paste();
    expect(ClipboardService['currentShift']).toBe(15);
    ClipboardService.paste();
    expect(ClipboardService['currentShift']).toBe(20);
    ClipboardService.paste();
    expect(ClipboardService['currentShift']).toBe(25);
  });

  it('#paste should reset shift if paste is about to add an element out of canvas on right', () => {
    addElementToSelection();
    ClipboardService.copy();
    ClipboardService['copyLeft'] = 93;
    expect(ClipboardService['currentShift']).toBe(5);
    ClipboardService.paste();
    expect(ClipboardService['currentShift']).toBe(10);
    ClipboardService.paste();
    expect(ClipboardService['currentShift']).toBe(10);
  });

  it('#paste should reset shift if paste is about to add an element out of canvas on bottom', () => {
    addElementToSelection();
    ClipboardService.copy();
    ClipboardService['copyTop'] = 93;
    expect(ClipboardService['currentShift']).toBe(5);
    ClipboardService.paste();
    expect(ClipboardService['currentShift']).toBe(10);
    ClipboardService.paste();
    expect(ClipboardService['currentShift']).toBe(10);
  });

  it('#paste should do nothing if a shift reset does not paste in canvas either', () => {
    addElementToSelection();
    ClipboardService.copy();
    ClipboardService['copyLeft'] = 99;
    ClipboardService['copyTop'] = 99;
    const pasteSpy = spyOn(Transform, 'setElements');

    ClipboardService.paste();
    expect(pasteSpy).not.toHaveBeenCalled();
  });

  it('#duplicate should should not save elements in clipboard', () => {
    addElementToSelection();
    expect(ClipboardService['selectedElements'].size()).toBe(0);
    ClipboardService.duplicate();
    expect(ClipboardService['selectedElements'].size()).toBe(0);
  });

  it('#duplicate should reset shift to far left and top if duplicate is about to add an element out of canvas on right or bottom', () => {
    addElementToSelection();
    const translateSpy = spyOn(Transform, 'translate');
    Transform.elementsToTransform[0].getBoundingClientRect = jasmine.createSpy().and.callFake(mockedElementBBox);
    ClipboardService.duplicate();
    expect(translateSpy).toHaveBeenCalledWith(-105, -105);
  });
});
