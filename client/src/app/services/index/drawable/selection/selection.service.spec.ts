import { TestBed, getTestBed } from '@angular/core/testing';

import { SelectionService } from './selection.service';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { Renderer2, Type } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';

describe('SelectionService', () => {
  let service: SelectionService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;

 /* const mockedGetBoundingBox = (): mockedBoundingBox => {
    console.log("mockedBBbox called");
    return new mockedBoundingBox(50, 150, 50, 150);
  };*/

  /*class mockedBoundingBox extends DOMRect {
    constructor(left: number, right: number, top: number, bottom: number) {
      super();
      this.left = left;
      this.right = right;
      this.top = top;
      this.bottom = bottom;
    }
    left: number;
    right: number;
    top: number;
    bottom: number;
  }

  class mockedSVGRectElement extends SVGRectElement {
    constructor() {
      super();
    }
    getBoundingClientRect(): mockedBoundingBox {
      return new mockedBoundingBox(50, 150, 50, 150);
    }
  }*/

  class mockedSVGRectElement extends SVGRectElement {
    constructor(){
      super()
    }
    getBoundingClientRect(): DOMRect {
      /*const boundLeft = 50;
      const boundRight = 150;
      const boundTop = 50;
      const boundBottom = 150;
      return {
        bottom: boundBottom,
        height: 100,
        left: boundLeft,
        right: boundRight,
        top: boundTop,
        width: 100,
        x: boundLeft,
        y: boundTop,
        toJSON(): () => any
      };*/
      return new DOMRect(50, 50, 100, 100);
    }
  }

  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SelectionService,
        {
          provide: Renderer2,
          useValue: {
              createElement: () => mockedRendered,
              setAttribute: () => mockedRendered,
              appendChild: () => mockedRendered,
              removeChild: () => mockedRendered,
          },
        },
        //{ provide: DOMRect, useClass: mockedBoundingBox },
        { provide: SVGRectElement, useClass: mockedSVGRectElement },
        { provide: ElementRef,
          useValue: {
            nativeElement: {
              getBoundingClientRect: () => {
                const boundLeft = 50;
                const boundRight = 150;
                const boundTop = 50;
                const boundBottom = 150;
                const boundRect = {
                  left: boundLeft,
                  right: boundRight,
                  top: boundTop,
                  bottom: boundBottom
                };
                return boundRect;
              }
            },
          },
        }
      ]
    });
    service = TestBed.get(SelectionService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>);
    service.initialize(manipulator, image, 
      getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>),
      getTestBed().get<DrawStackService>(DrawStackService as Type<DrawStackService>));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#isInSelectionArea should return true when position is in area', () => {
    const position = new CoordinatesXY(100, 100);
    //service['manipulator'] = manipulator;
    //service['setupProperties']();
    //service['selectionRect'] = manipulator.createElement('SVGRectElement')
    //spyOn(service['selectionRect'], 'getBoundingClientRect').and.returnValue(new DOMRect);
    //service['selectionRect'].getBoundingClientRect = jasmine.createSpy().and.returnValue(boundRect);
    service['selectionRect'] = new mockedSVGRectElement();
    //const spy: jasmine.Spy = jasmine.createSpyObj('SVGRectElement', ['getBoundingClientRect']);
    //spy.and.returnValue(boundRect);
    const isInSelection = service['isInSelectionArea'](position);
    expect(isInSelection).toBe(true);
  });
});
