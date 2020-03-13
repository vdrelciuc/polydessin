import { TestBed, getTestBed } from '@angular/core/testing';

import { SelectionService } from './selection.service';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { Renderer2, Type } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
// import { SVGProperties } from 'src/app/classes/svg-html-properties';

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

  /*class mockedSVGRectElement extends SVGRectElement {
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
      };
      return new DOMRect(50, 50, 100, 100);
    }
  }*/

  // const mockedRendered = (): Element => {
  //   // const element = new SVGRectElement();
  //   const element = manipulator.createElement(SVGProperties.rectangle, 'http://www.w3.org/2000/svg');
  //   // parentElement.children.push(element);
  //   return element;
  // };

  /*const renderer2Mock = jasmine.createSpyObj('renderer2Mock', [
    'destroy',
    'createElement',
    'createComment',
    'createText',
    'destroyNode',
    'appendChild',
    'insertBefore',
    'removeChild',
    'selectRootElement',
    'parentNode',
    'nextSibling',
    'setAttribute',
    'removeAttribute',
    'addClass',
    'removeClass',
    'setStyle',
    'removeStyle',
    'setProperty',
    'setValue',
    'listen'
  ]);
  
  const rootRendererMock =  {
    renderComponent: () => {
        return renderer2Mock;
    }
  };*/

  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): DOMRect => {
    const element = new Element();
    parentElement.children.push(element);
    return new DOMRect(50, 50, 100, 100);
  };

  /*function createMockDiv() {
    const width = 100;
    const height = 100;
    const div = document.createElement("div");
    Object.assign(div.style, {
      width: width+"px",
      height: height+"px",
    });
    // we have to mock this for jsdom.
    div.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      width: width,
      height: height,
      top: 0,
      left: 0,
      right: width,
      bottom: height,
      toJSON: () => {return null}
    });
    return div;
  }*/

  const mockedBBox = () => ({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    top: 0,
    left: 0,
    right: 100,
    bottom: 100,
    toJSON: () => {return null}
  });

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
        { provide: SVGRectElement.prototype.getBoundingClientRect, called: { getBoundingClientRect: () => { return new DOMRect(50, 50, 100, 100) } } },
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
    const position = new CoordinatesXY(50, 50);
    //service['manipulator'] = manipulator;
    //service['setupProperties']();
    //service['selectionRect'] = manipulator.createElement('SVGRectElement')
    //service['selectionRect'] = document.createElementNS('http://www.w3.org/1999/xhtml','rect')
    //spyOn(service['selectionRect'], 'getBoundingClientRect').and.callFake(mockedBBox);
    service['selectionRect'].getBoundingClientRect = jasmine.createSpy().and.callFake(mockedBBox);
    //service['selectionRect'] = new mockedSVGRectElement();
    //const spy: jasmine.Spy = jasmine.createSpyObj('SVGRectElement', ['getBoundingClientRect']);
    //spy.and.returnValue(boundRect);
    //Element.prototype.getBoundingClientRect;
    //console.log(`manipulator: ${JSON.stringify(service["manipulator"])}`);
    console.log("selectionRect: " + service['selectionRect']);
    const isInSelection = service['isInSelectionArea'](position);
    expect(isInSelection).toBe(true);
  });
});
