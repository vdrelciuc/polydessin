import { TestBed } from '@angular/core/testing';

import { DrawStackService } from './draw-stack.service';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { Stack } from 'src/app/classes/stack';
import { SVGElementInfos } from 'src/app/interfaces/svg-element-infos';

describe('DrawStackService', () => {
  let service: DrawStackService;
  const mockedSVGElementInfo = {
    target: null as unknown as SVGGElement,
    id: 0
  };

  beforeEach(() => {
    TestBed.configureTestingModule({

    });
    service = TestBed.get(DrawStackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#addElementWithInfos should add first element', () => {
    mockedSVGElementInfo.id = 0;
    const spy = spyOn(service['elements'], 'insert');
    service.addElementWithInfos(mockedSVGElementInfo);
    expect(service.changeAt.value).toEqual(0);
    expect(spy).toHaveBeenCalled();
  });

  it('#addElementWithInfos should add first element with good id', () => {
    const spy = spyOn(service['elements'], 'insert');
    service['nextId'] = 2;
    service.addElementWithInfos({
      target: null as unknown as SVGGElement,
      id: 1
    });
    expect(service.changeAt.value).toEqual(0);
    expect(spy).toHaveBeenCalled();
  });

  it('#addFromUndo should add element from undo', () => {
    mockedSVGElementInfo.id = 10;
    service.addFromUndo(mockedSVGElementInfo);
    const addedElement = service['elements'].pop_back();
    if(addedElement !== undefined) {
      expect(addedElement.id).toEqual(10);
    }
  });

  it('#removeElement should remove valid element', () => {
    mockedSVGElementInfo.id = 15;
    service['elements'].push_back(mockedSVGElementInfo);
    expect(service['elements'].getAll().length).not.toEqual(0);
    service.removeElement(15);
    expect(service['elements'].getAll().length).toEqual(0);
  });

  it('#removeElement shouldn\'t remove non valid element', () => {
    mockedSVGElementInfo.id = 0;
    service['elements'].push_back(mockedSVGElementInfo);
    expect(service['elements'].getAll().length).toEqual(1);
    service.removeElement(15);
    expect(service['elements'].getAll().length).toEqual(1);
  });

  it('#removeLastElement should return undefined, stack is empty', () => {
    expect(service.removeLastElement()).toEqual(undefined);
  });

  it('#removeLastElement should last inserted element', () => {
    mockedSVGElementInfo.id = 11;
    service['nextId'] = 4;
    service['elements'].push_back(mockedSVGElementInfo);
    expect(service.removeLastElement()).toEqual(mockedSVGElementInfo);
    expect(service['nextId']).toEqual(3);
  });

  it('#removeElements shouldn\'t remove, stack is empty', () => {
    expect(service.removeElements(0).getAll().length).toEqual(0);
  });

  it('#removeElements should remove all elements from 0', () => {
    mockedSVGElementInfo.id = 1;
    service['elements'].push_back(mockedSVGElementInfo);
    mockedSVGElementInfo.id = 2;
    service['elements'].push_back(mockedSVGElementInfo);
    mockedSVGElementInfo.id = 3;
    service['elements'].push_back(mockedSVGElementInfo);
    expect(service.removeElements(0).getAll().length).toEqual(3);
    expect(service['elements'].getAll().length).toEqual(0);
  });

  it('#removeElements should remove elements from 1', () => {
    mockedSVGElementInfo.id = 0;
    service['elements'].push_back(mockedSVGElementInfo);
    mockedSVGElementInfo.id = 1;
    service['elements'].push_back(mockedSVGElementInfo);
    mockedSVGElementInfo.id = 2;
    service['elements'].push_back(mockedSVGElementInfo);
    expect(service.removeElements(1).getAll().length).toEqual(2);
    expect(service['elements'].getAll().length).toEqual(1);
  });

  it('#findTopElementAt shouldn\'t find element, stack is empty', () => {
    expect(service.findTopElementAt(new CoordinatesXY(10,10))).toEqual(undefined);
  });

  it('#findTopElementAt should find the element at the correct position', () => {
    const mockedStack = new Stack<SVGElementInfos>();
    const element1 = {getBoundingClientRect: () => new DOMRect(10,10,10,10)};
    const element2 = {getBoundingClientRect: () => new DOMRect(1000,1000,10,10)};
    mockedStack.push_back({target: element1 as unknown as SVGGElement, id: 0 });
    mockedStack.push_back({target: element2 as unknown as SVGGElement, id: 1 });
    const foundElement = DrawStackService.findTopElementAt(
      new CoordinatesXY(5,5),
      mockedStack
    );
    if(foundElement !== undefined) {
      expect(foundElement.id).toEqual(0);
    }
    else {
      expect(false).toBeTruthy();
    }
  });  

  it('#getRoot should get first as undefined, stack is empty', () => {
    expect(service.getRoot()).toEqual(undefined);
  });

  it('#getRoot should get first element', () => {
    mockedSVGElementInfo.id = 99;
    service['elements'].push_back(mockedSVGElementInfo);
    const popedRoot = service.getRoot()
    if(popedRoot !== undefined) {
      expect(popedRoot.id).toEqual(99);
    } else {
      expect(false).toBeTruthy();
    }
  });
});
