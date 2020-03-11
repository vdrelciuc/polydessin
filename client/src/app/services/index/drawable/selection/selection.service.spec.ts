import { TestBed } from '@angular/core/testing';

import { SelectionService } from './selection.service';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { ElementRef } from '@angular/core';

describe('SelectionService', () => {
  let service: SelectionService;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        //{ provide: DOMRect, useClass: mockedBoundingBox },
        //{ provide: SVGRectElement, useClass: mockedSVGRectElement },
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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#isInSelectionArea should return true when position is in area', () => {
    const position = new CoordinatesXY(100, 100);
    //spyOn(service['selectionRect'], 'getBoundingClientRect').and.callFake(mockedGetBoundingBox);
    //service['selectionRect'].getBoundingClientRect = jasmine.createSpy().and.returnValue(mockedGetBoundingBox);
    //service['selectionRect'] = new mockedSVGRectElement();
    const isInSelection = service['isInSelectionArea'](position);
    expect(isInSelection).toBe(true);
  });
});
