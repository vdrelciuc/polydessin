// tslint:disable: no-magic-numbers | Reason : testing with arbitrary values
import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DrawStackService } from '../draw-stack/draw-stack.service';
import { UndoRedoService } from './undo-redo.service';

describe('UndoRedoService', () => {

  let service: UndoRedoService;
  let drawStack: DrawStackService;

  // tslint:disable-next-line: no-any | Reason : parentElement: Element creates an issue
  const mockedRendered = (parentElement: any, name: string, debugInfo?: string): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  };

  let mockedSVG = {
    getBoundingClientRect:
      () => new DOMRect(10, 10, 100, 100),
      childElementCount: 1,
      childNodes: () => new Array()
  };

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
                cloneNode: () => {
                  const boundleft = 0;
                  const boundtop = 0;
                  const boundRect = {
                      left: boundleft,
                      top: boundtop,
                  };
                  return boundRect;
              },
              childNodes: new Array()
            },
          },
        },
        DrawStackService
      ],
    });
    service = TestBed.get(UndoRedoService);
    drawStack = TestBed.get<DrawStackService>(DrawStackService);
    mockedSVG = {
      getBoundingClientRect:
        () => new DOMRect(10, 10, 100, 100),
        childElementCount: 1,
        childNodes: () => new Array()
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should change current svg and add old one to elements', () => {
    drawStack.addedSVG.next(mockedSVG as unknown as SVGElement);
    expect(service['elements'].getAll().length).toEqual(1);
    expect(service['currentSVG'].getBoundingClientRect()).toEqual(
      new DOMRect(10, 10, 100, 100)
    );
    expect(drawStack.addedSVG.value).toEqual(undefined);
  });

  it('should change current svg and add old one to redo', () => {
    drawStack.addedToRedo.next(mockedSVG as unknown as SVGElement);
    expect(service['removed'].getAll().length).toEqual(1);
    expect(service['currentSVG'].getBoundingClientRect()).toEqual(
      new DOMRect(10, 10, 100, 100)
    );
    expect(drawStack.addedToRedo.value).toEqual(undefined);
  });

  it('should reset redo stack', () => {
    service['removed'].push_back(mockedSVG as unknown as SVGElement);
    expect(service['removed'].getAll().length).toEqual(1);
    drawStack.reset.next(true);
    expect(service['removed'].getAll().length).toEqual(0);
    expect(drawStack.reset.value).toEqual(false);
  });

  it('#undo should undo last action (being the only action)', () => {
    service['currentSVG'] = {
      getBoundingClientRect: () => new DOMRect(10, 10, 1000, 1000),
      childElementCount: 0
    } as SVGElement;
    expect(service['currentSVG'].childElementCount).toEqual(0);
    service['elements'].push_back(mockedSVG as unknown as SVGElement);
    service.undo();
    expect(service['changed'].value).toEqual(true);
    expect(service['currentSVG'].childElementCount).toEqual(1);
  });

  it('#undo should undo last action not the only', () => {
    service['currentSVG'] = {
      getBoundingClientRect: () => new DOMRect(10, 10, 1000, 1000),
      childElementCount: 2
    } as SVGElement;
    expect(service['currentSVG'].childElementCount).toEqual(2);
    service['elements'].push_back(mockedSVG as unknown as SVGElement);
    mockedSVG.childElementCount = 10;
    service['elements'].push_back(mockedSVG as unknown as SVGElement);
    expect(service['removed'].getAll().length).toEqual(0);
    service.undo();
    expect(service['removed'].getAll().length).toEqual(1);
    expect(service['currentSVG'].childElementCount).toEqual(10);
  });

  it('#undo should not undo because stack is empty', () => {
    service['currentSVG'] = mockedSVG as unknown as SVGElement;
    expect(service['changed'].value).toEqual(false);
    expect(service['elements'].getAll().length).toEqual(0);
    service.undo();
    expect(service['currentSVG']).toEqual(mockedSVG as unknown as SVGElement);
    expect(service['elements'].getAll().length).toEqual(0);
    expect(service['changed'].value).toEqual(false);
  });

  it('#redo should be able to redo last action', () => {
    service['removed'].push_back(mockedSVG as unknown as SVGElement);
    expect(service['changed'].value).toEqual(false);
    service.redo();
    expect(service['currentSVG']).toEqual(mockedSVG as unknown as SVGElement);
    expect(service['changed'].value).toEqual(true);
  });

  it('#redo should not redo because stack is empty', () => {
    expect(service['removed'].getAll().length).toEqual(0);
    service['currentSVG'] = mockedSVG as unknown as SVGElement;
    expect(service['changed'].value).toEqual(false);
    service.redo();
    expect(service['currentSVG']).toEqual(mockedSVG as unknown as SVGElement);
    expect(service['changed'].value).toEqual(false);
  });
});
