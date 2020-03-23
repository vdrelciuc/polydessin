// tslint:disable: no-any max-file-line-count
import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import * as CONSTANTS from 'src/app/classes/constants';
import { CoordinatesXY } from 'src/app/classes/coordinates-x-y';
import { Transform } from 'src/app/classes/transformations';
import { SelectionState } from 'src/app/enums/selection-states';
import { ColorSelectorService } from 'src/app/services/color-selector/color-selector.service';
import { DrawStackService } from 'src/app/services/draw-stack/draw-stack.service';
import { SelectionService } from './selection.service';

describe('SelectionService', () => {
  let service: SelectionService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;

  let canvas: SVGElement;
  let canvasParent: Element;
  let def: Element;
  let firstGElement: SVGGElement;
  let clickedElement: SVGElement;
  let secondGElement: SVGGElement;
  let unselectedElement: SVGElement;
  let gResizeGroup: SVGGElement;
  let controlPoint: SVGRectElement;

  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  };

  const mouseEventMocker = (event: string, keyUsed: number, x: number, y: number) =>
    new MouseEvent(event, {button: keyUsed, clientX: x, clientY: y});

  const mockedBBox = () => ({ x: 0, y: 0, width: 100, height: 100, top: 0, left: 0, right: 100, bottom: 100, toJSON: () =>  null });
  const mockedBBox2 = () => ({ x: 5, y: 5, width: 100, height: 100, top: 5, left: 5, right: 105, bottom: 105, toJSON: () =>  null });
  const mockedBBox3 = () => ({ x: 200, y: 200, width: 10, height: 10, top: 200, left: 200, right: 210, bottom: 210, toJSON: () =>  null });

  const setupElementsInCanvas = () => {
    canvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    canvasParent = document.createElement('APP-CANVAS');
    canvasParent.appendChild(canvas);

    def = document.createElementNS('http://www.w3.org/2000/svg', 'def');
    canvas.appendChild(def);

    firstGElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    clickedElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    firstGElement.appendChild(clickedElement);
    canvas.appendChild(firstGElement);

    secondGElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    unselectedElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    secondGElement.appendChild(unselectedElement);
    canvas.appendChild(secondGElement);

    gResizeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    controlPoint = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    gResizeGroup.appendChild(controlPoint);
    canvas.appendChild(gResizeGroup);
    service['controlPoints'] = [controlPoint];
    service['resizeGroup'] = gResizeGroup;
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

    service['selectionRect'].getBoundingClientRect = jasmine.createSpy().and.callFake(mockedBBox);
    service['transformShortcuts'].setupShortcuts = jasmine.createSpy().and.callFake(() => undefined);
    service['image'].nativeElement.cloneNode = jasmine.createSpy().and.returnValue(undefined);
    service['subElement'].remove = jasmine.createSpy().and.returnValue(mockedRendered);
    service['resizeGroup'].remove = jasmine.createSpy().and.returnValue(mockedRendered);
    service['state'] = SelectionState.idle;
    setupElementsInCanvas();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#endTool should reset selection tool', () => {
    service.endTool();
    expect(service['selectedElements'].getAll().length).toBe(0);
    expect(service['elementsToInvert'].getAll().length).toBe(0);
  });

  it('#endTool should not remove selection elements in DOM if they do not exist', () => {
    const spy = spyOn<any>(service['manipulator'], 'removeChild');
    spyOn<any>(service['manipulator'], 'createElement').and.returnValue(undefined);
    service['setupProperties']();
    service.endTool();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#onMouseOutCanvas should be considered as a mouse release', () => {
    const mouseReleaseSpy = spyOn<any>(service, 'onMouseRelease');
    const event = mouseEventMocker('mousemove', CONSTANTS.LEFT_CLICK, 0, 0);
    service.onMouseOutCanvas(event);
    expect(mouseReleaseSpy).toHaveBeenCalled();
  });

  it('#onMousePress should cancel ongoing selection if state was not idle', () => {
    const mouseReleaseSpy = spyOn<any>(service, 'onMouseRelease');
    const mockedEvent = mouseEventMocker('mousedown', CONSTANTS.LEFT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: clickedElement });

    service['state'] = SelectionState.moving;
    service.onMousePress(mockedEvent);
    expect(mouseReleaseSpy).toHaveBeenCalled();
  });

  it('#onMousePress should do nothing if registered click was not left or right click', () => {
    const mockedEvent = mouseEventMocker('mousedown', 1, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: clickedElement });

    service.onMousePress(mockedEvent);
    expect(service['state']).toBe(SelectionState.idle);
  });

  it('#onMousePress with left click should go to resizing if a control point is clicked', () => {
    const mockedEvent = mouseEventMocker('mousedown', CONSTANTS.LEFT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: controlPoint });

    service.onMousePress(mockedEvent);
    expect(service['state']).toBe(SelectionState.resizingTop);
  });

  it('#onMousePress with left click should wait for mouse release if clicked element is in selection', () => {
    const mockedEvent = mouseEventMocker('mousedown', CONSTANTS.LEFT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: clickedElement });

    service['selectedElements'].push_back(firstGElement);
    service['selectedElements'].push_back(secondGElement);
    service.onMousePress(mockedEvent);
    expect(service['state']).toBe(SelectionState.leftClickInSelection);
    expect(service['selectedElements'].getAll().length).toBe(2); // Should not have reset
  });

  it('#onMousePress with left click should select new element if clicked element is not in selection', () => {
    const mockedEvent = mouseEventMocker('mousedown', CONSTANTS.LEFT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: unselectedElement });

    service['selectedElements'].push_back(firstGElement);
    service['elementsToInvert'].push_back(secondGElement);
    const singleClickSpy = spyOn<any>(service, 'onSingleClick').and.callThrough();
    service.onMousePress(mockedEvent);
    expect(singleClickSpy).toHaveBeenCalled();
    expect(service['state']).toBe(SelectionState.leftClickInSelection);
    expect(service['selectedElements'].getAll()[0].firstChild as SVGElement).toEqual(unselectedElement);
  });

  it('#onMousePress with left click should unselect all elements if canvas is clicked', () => {
    const outOfSelectionCoord = 150;
    const mockedEvent = mouseEventMocker('mousedown', CONSTANTS.LEFT_CLICK, outOfSelectionCoord, outOfSelectionCoord);
    Object.defineProperty(mockedEvent, 'target', { value: canvas });

    service['selectedElements'].push_back(firstGElement);
    service.onMousePress(mockedEvent);
    expect(service['selectedElements'].getAll().length).toBe(0);
  });

  it('#onMousePress with right click should wait for mouse release to invert selection', () => {
    const mockedEvent = mouseEventMocker('mousedown', CONSTANTS.RIGHT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: clickedElement });

    const invertSpy = spyOn<any>(service, 'addOrInvertEachElementInRect');
    service.onMousePress(mockedEvent);
    expect(service['state']).toBe(SelectionState.singleRightClick);
    expect(invertSpy).not.toHaveBeenCalled();
  });

  it('#onMousePress with right click on canvas should do nothing', () => {
    const mockedEvent = mouseEventMocker('mousedown', CONSTANTS.RIGHT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: canvas });

    const invertSpy = spyOn<any>(service, 'addOrInvertEachElementInRect');
    service.onMousePress(mockedEvent);
    service.onMouseRelease(mockedEvent);
    expect(invertSpy).not.toHaveBeenCalled();
  });

  it('#onMouseRelease should select new element if mouse was not moved after left click in selection', () => {
    const mockedEvent = mouseEventMocker('mouseup', CONSTANTS.LEFT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: clickedElement });
    spyOn<any>(service, 'getBBoxWithStroke').and.callFake(mockedBBox);

    service['state'] = SelectionState.leftClickInSelection;
    service['selectedElements'].push_back(firstGElement);
    service['selectedElements'].push_back(secondGElement);
    service.onMouseRelease(mockedEvent);
    expect(service['selectedElements'].getAll().length).toBe(1); // Should have reset
  });

  it('#onMouseRelease should select new element if mouse was not moved after left click out of selection', () => {
    const mockedEvent = mouseEventMocker('mouseup', CONSTANTS.LEFT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: clickedElement });
    spyOn<any>(service, 'getBBoxWithStroke').and.callFake(mockedBBox);

    service['state'] = SelectionState.singleLeftClickOutOfSelection;
    service['selectedElements'].push_back(firstGElement);
    service['selectedElements'].push_back(secondGElement);
    service.onMouseRelease(mockedEvent);
    expect(service['selectedElements'].getAll().length).toBe(1); // Should have reset
  });

  it('#onMouseRelease should add unselected clicked element if mouse was not moved after right click', () => {
    const mockedEvent = mouseEventMocker('mouseup', CONSTANTS.RIGHT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: unselectedElement });
    spyOn<any>(service, 'getBBoxWithStroke').and.callFake(mockedBBox);

    service['state'] = SelectionState.singleRightClick;
    service['selectedElements'].push_back(firstGElement);
    service.onMouseRelease(mockedEvent);
    expect(service['selectedElements'].getAll().length).toBe(2);
  });

  it('#onMouseRelease should remove selected clicked element if mouse was not moved after right click', () => {
    const mockedEvent = mouseEventMocker('mouseup', CONSTANTS.RIGHT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: clickedElement });

    service['state'] = SelectionState.singleRightClick;
    service['selectedElements'].push_back(firstGElement);
    service['clickedElement'] = firstGElement;
    service.onMouseRelease(mockedEvent);
    expect(service['selectedElements'].getAll().length).toBe(0);
  });

  it('#onMouseRelease should remove selection box after a selection drag', () => {
    const mockedEvent = mouseEventMocker('mouseup', CONSTANTS.LEFT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: clickedElement });

    service['state'] = SelectionState.selecting;
    service['selectedElements'].push_back(firstGElement);
    const spy = spyOn<any>(service['manipulator'], 'removeChild');
    service.onMouseRelease(mockedEvent);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('#onMouseRelease should remove selection box after an inversion drag', () => {
    const mockedEvent = mouseEventMocker('mouseup', CONSTANTS.LEFT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: clickedElement });

    service['state'] = SelectionState.inverting;
    service['selectedElements'].push_back(firstGElement);
    service['elementsToInvert'].push_back(firstGElement);
    service['elementsToInvert'].push_back(secondGElement);
    const spy = spyOn<any>(service['manipulator'], 'removeChild');
    service.onMouseRelease(mockedEvent);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('#onMouseRelease should allow undo/redo after mouse was released', () => {
    const mockedEvent = mouseEventMocker('mouseup', CONSTANTS.LEFT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: clickedElement });

    service['state'] = SelectionState.moving;
    const spy = spyOn<any>(service['drawStack'], 'addSVGWithNewElement');
    service.onMouseRelease(mockedEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseMove should select elements in area if mouse is dragged with left click', () => {
    const mockedEvent = mouseEventMocker('mousemove', CONSTANTS.LEFT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: clickedElement });
    spyOn<any>(CoordinatesXY, 'getEffectiveCoords').and.returnValue(new CoordinatesXY(2, 2));

    Object.defineProperty(image.nativeElement, 'childNodes', { value: canvas.childNodes });
    spyOn<any>(service, 'getBBoxWithStroke').and.callFake(mockedBBox);

    service['selectionOrigin'] = new CoordinatesXY(0, 0);
    service['state'] = SelectionState.singleLeftClickOutOfSelection;
    service.onMouseMove(mockedEvent);
    expect(service['selectedElements'].getAll().length).toBe(2);
  });

  it('#onMouseMove should select no element in area if mouse is dragged with left click over no element', () => {
    const mockedEvent = mouseEventMocker('mousemove', CONSTANTS.LEFT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: clickedElement });
    spyOn<any>(CoordinatesXY, 'getEffectiveCoords').and.returnValue(new CoordinatesXY(2, 2));

    Object.defineProperty(image.nativeElement, 'childNodes', { value: canvas.childNodes });
    spyOn<any>(service, 'getBBoxWithStroke').and.callFake(mockedBBox3);

    service['selectionOrigin'] = new CoordinatesXY(0, 0);
    service['state'] = SelectionState.singleLeftClickOutOfSelection;
    service.onMouseMove(mockedEvent);
    expect(service['selectedElements'].getAll().length).toBe(0);
  });

  it('#onMouseMove should invert elements in area if mouse is dragged with right click', () => {
    const mockedEvent = mouseEventMocker('mousemove', CONSTANTS.RIGHT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: clickedElement });
    spyOn<any>(CoordinatesXY, 'getEffectiveCoords').and.returnValue(new CoordinatesXY(2, 2));

    Object.defineProperty(image.nativeElement, 'childNodes', { value: canvas.childNodes });
    spyOn<any>(service, 'getBBoxWithStroke').and.callFake(mockedBBox);

    service['selectionOrigin'] = new CoordinatesXY(0, 0);
    service['state'] = SelectionState.singleRightClick;
    service.onMouseMove(mockedEvent);
    expect(service['elementsToInvert'].getAll().length).toBe(2);
  });

  it('#onMouseMove should translate all selected elements if selection is dragged', () => {
    const mockedEvent = mouseEventMocker('mousemove', CONSTANTS.LEFT_CLICK, 0, 0);
    Object.defineProperty(mockedEvent, 'target', { value: clickedElement });
    spyOn<any>(CoordinatesXY, 'getEffectiveCoords').and.returnValue(new CoordinatesXY(1, 0));
    const translateSpy = spyOn<any>(Transform, 'translate').and.callFake(() => undefined);
    service['oldMousePosition'] = new CoordinatesXY(0, 0);

    service['clickedElement'] = firstGElement;
    service['state'] = SelectionState.leftClickInSelection;
    service.onMouseMove(mockedEvent);
    expect(translateSpy).toHaveBeenCalled();
  });

  it('#getBBoxWithStroke should check stroke thickness if element is path or line', () => {
    const gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    gElement.appendChild(pathElement);
    gElement.getBoundingClientRect = jasmine.createSpy().and.callFake(mockedBBox);
    pathElement.getBoundingClientRect = jasmine.createSpy().and.callFake(mockedBBox2);
    pathElement.getAttribute = jasmine.createSpy().and.returnValue('2');

    const newBBox = service['getBBoxWithStroke'](gElement);
    const expectedMaxBBox = 106;
    expect(newBBox.left).toBe(0);
    expect(newBBox.right).toBe(expectedMaxBBox);
    expect(newBBox.top).toBe(0);
    expect(newBBox.bottom).toBe(expectedMaxBBox);
  });

  it('#getBBoxWithStroke should not check stroke thickness if element is not path or line', () => {
    const gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    gElement.appendChild(pathElement);
    gElement.getBoundingClientRect = jasmine.createSpy().and.callFake(mockedBBox);
    pathElement.getBoundingClientRect = jasmine.createSpy().and.callFake(mockedBBox2);
    pathElement.getAttribute = jasmine.createSpy().and.returnValue('2');

    const newBBox = service['getBBoxWithStroke'](gElement);
    const expectedMaxBBox = 100;
    expect(newBBox.left).toBe(0);
    expect(newBBox.right).toBe(expectedMaxBBox);
    expect(newBBox.top).toBe(0);
    expect(newBBox.bottom).toBe(expectedMaxBBox);
  });

  it('#selectAllElements should select all elements in canvas', () => {
    Object.defineProperty(image.nativeElement, 'childNodes', { value: canvas.childNodes });
    service.selectAllElements();
    expect(service['selectedElements'].getAll().length).toBe(2);
  });
});
