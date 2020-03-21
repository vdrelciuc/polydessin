import { getTestBed, TestBed } from '@angular/core/testing';
import { Renderer2, ElementRef, Type } from '@angular/core';
import { SelectionTransformShortcutService } from './selection-transform-shortcut.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import { Stack } from 'src/app/classes/stack';
import { Transform } from 'src/app/classes/transformations';
import * as CONSTANTS from 'src/app/classes/constants';

describe('SelectionTransformShortcutService', () => {
  let service: SelectionTransformShortcutService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;
  let drawStack: DrawStackService;
  let elementsToTransform: Stack<SVGGElement>;
  let selectionGroup: SVGGElement;

  let mockedEvent: KeyboardEvent;

  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  };

  const eventMocker = (event: string, keyUsed: string) => new KeyboardEvent(event, {key: keyUsed});

  const mockedListener = (target: any, eventName: string, callback: (event: any) => boolean | void): () => void => {
    if (eventName === 'keydown') {
      window.addEventListener<'keydown'>(eventName, () => service['onKeyDown'](mockedEvent.key));
    } else if (eventName === 'keyup') {
      window.addEventListener<'keyup'>(eventName, () => service['onKeyUp'](mockedEvent.key));
    }

    return () => {};
  }

  const setupElementsToTransform = (): void => {
    elementsToTransform = new Stack<SVGGElement>();

    for (let i = 0; i < 10; i++) {
      const element: SVGGElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      elementsToTransform.push_back(element);
    }
    Transform.setElements(elementsToTransform, manipulator);

    selectionGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
      {
        provide: Renderer2,
        useValue: {
            createElement: () => mockedRendered,
            setAttribute: () => mockedRendered,
            appendChild: () => mockedRendered,
            removeChild: () => mockedRendered
        },
      },
      {
        provide: ElementRef,
        useValue: {
            nativeElement: {}
          },
        },
        DrawStackService,
        Transform
      ],
    });
    service = getTestBed().get(SelectionTransformShortcutService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>);
    drawStack = getTestBed().get(DrawStackService);

    setupElementsToTransform();
    manipulator.listen = jasmine.createSpy().and.callFake(mockedListener);
    image.nativeElement.cloneNode = jasmine.createSpy().and.returnValue(undefined);
    service.setupShortcuts(manipulator, drawStack, image, selectionGroup);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#setupShortcuts should initialize its class attributes', () => {
    expect(service['manipulator']).toBeDefined();
    expect(service['drawStack']).toBeDefined();
    expect(service['image']).toBeDefined();
    expect(service['selectionGroup']).toBeDefined();
  });

  it('#onKeyDown should translate left when left key is pressed only once', () => {
    mockedEvent = eventMocker('keydown', CONSTANTS.LEFT);

    const keyDownSpy = spyOn<any>(service, 'onKeyDown').and.callThrough();
    const transformSpy = spyOn<any>(Transform, 'translate').and.callThrough();
    window.dispatchEvent(mockedEvent);

    expect(keyDownSpy).toHaveBeenCalled();
    expect(transformSpy).toHaveBeenCalledTimes(1);
    expect(transformSpy).toHaveBeenCalledWith(-CONSTANTS.UNIT_MOVE, 0);

    window.dispatchEvent(mockedEvent);
    expect(transformSpy).toHaveBeenCalledTimes(1);
  });

  it('#onKeyDown should translate right when right key is pressed only once', () => {
    mockedEvent = eventMocker('keydown', CONSTANTS.RIGHT);

    const keyDownSpy = spyOn<any>(service, 'onKeyDown').and.callThrough();
    const transformSpy = spyOn<any>(Transform, 'translate').and.callThrough();
    window.dispatchEvent(mockedEvent);

    expect(keyDownSpy).toHaveBeenCalled();
    expect(transformSpy).toHaveBeenCalledTimes(1);
    expect(transformSpy).toHaveBeenCalledWith(CONSTANTS.UNIT_MOVE, 0);

    window.dispatchEvent(mockedEvent);
    expect(transformSpy).toHaveBeenCalledTimes(1);
  });

  it('#onKeyDown should translate up when up key is pressed only once', () => {
    mockedEvent = eventMocker('keydown', CONSTANTS.UP);

    const keyDownSpy = spyOn<any>(service, 'onKeyDown').and.callThrough();
    const transformSpy = spyOn<any>(Transform, 'translate').and.callThrough();
    window.dispatchEvent(mockedEvent);

    expect(keyDownSpy).toHaveBeenCalled();
    expect(transformSpy).toHaveBeenCalledTimes(1);
    expect(transformSpy).toHaveBeenCalledWith(0, -CONSTANTS.UNIT_MOVE);

    window.dispatchEvent(mockedEvent);
    expect(transformSpy).toHaveBeenCalledTimes(1);
  });

  it('#onKeyDown should translate down when down key is pressed only once', () => {
    mockedEvent = eventMocker('keydown', CONSTANTS.DOWN);

    const keyDownSpy = spyOn<any>(service, 'onKeyDown').and.callThrough();
    const transformSpy = spyOn<any>(Transform, 'translate').and.callThrough();
    window.dispatchEvent(mockedEvent);

    expect(keyDownSpy).toHaveBeenCalled();
    expect(transformSpy).toHaveBeenCalledTimes(1);
    expect(transformSpy).toHaveBeenCalledWith(0, CONSTANTS.UNIT_MOVE);

    window.dispatchEvent(mockedEvent);
    expect(transformSpy).toHaveBeenCalledTimes(1);
  });

  it('#autoMove should not translate selection during first delay if key is held down', () => {
    mockedEvent = eventMocker('keydown', CONSTANTS.LEFT);
    jasmine.clock().install();

    const transformSpy = spyOn<any>(Transform, 'translate').and.callThrough();
    window.dispatchEvent(mockedEvent);

    jasmine.clock().tick(CONSTANTS.FIRST_DELAY - 1);
    expect(transformSpy).toHaveBeenCalledTimes(1)
    jasmine.clock().tick(2);
    expect(transformSpy).toHaveBeenCalledTimes(2)

    jasmine.clock().uninstall();
  });

  it('#autoMove should translate selection every 100 ms if key is held down and first delay is passed', () => {
    mockedEvent = eventMocker('keydown', CONSTANTS.LEFT);
    jasmine.clock().install();

    const transformSpy = spyOn<any>(Transform, 'translate').and.callThrough();
    window.dispatchEvent(mockedEvent);

    jasmine.clock().tick(CONSTANTS.FIRST_DELAY);
    expect(transformSpy).toHaveBeenCalledTimes(2)
    jasmine.clock().tick(CONSTANTS.MOVE_DELAY);
    expect(transformSpy).toHaveBeenCalledTimes(3)
    jasmine.clock().tick(CONSTANTS.MOVE_DELAY);
    expect(transformSpy).toHaveBeenCalledTimes(4)
    jasmine.clock().tick(CONSTANTS.MOVE_DELAY);
    expect(transformSpy).toHaveBeenCalledTimes(5)
    jasmine.clock().tick(CONSTANTS.MOVE_DELAY);
    expect(transformSpy).toHaveBeenCalledTimes(6)

    jasmine.clock().uninstall();
  });

  it('#autoMove should reset when selection is no longer moving and allow undo/redo', () => {
    service['isMoving'] = false;
    service['autoMove']();

    expect(service['hasWaitedHalfSec']).toBe(false);
    expect(service['autoMoveHasInstance']).toBe(false);
  });

  it('#onKeyUp should set corresponding released keys to false', () => {
    service['leftArrowIsPressed'] = true;
    service['rightArrowIsPressed'] = true;
    service['upArrowIsPressed'] = true;
    service['downArrowIsPressed'] = true;

    const keyUpSpy = spyOn<any>(service, 'onKeyUp').and.callThrough();
    mockedEvent = eventMocker('keyup', CONSTANTS.LEFT);
    window.dispatchEvent(mockedEvent);
    mockedEvent = eventMocker('keyup', CONSTANTS.RIGHT);
    window.dispatchEvent(mockedEvent);
    mockedEvent = eventMocker('keyup', CONSTANTS.UP);
    window.dispatchEvent(mockedEvent);
    mockedEvent = eventMocker('keyup', CONSTANTS.DOWN);
    window.dispatchEvent(mockedEvent);

    expect(keyUpSpy).toHaveBeenCalled();
    expect(service['leftArrowIsPressed']).toBe(false);
    expect(service['rightArrowIsPressed']).toBe(false);
    expect(service['upArrowIsPressed']).toBe(false);
    expect(service['downArrowIsPressed']).toBe(false);
  });

  it('#onKeyUp should stop translation if all key are released', () => {
    mockedEvent = eventMocker('keydown', CONSTANTS.LEFT);
    window.dispatchEvent(mockedEvent);
    expect(service['isMoving']).toBe(true);
    mockedEvent = eventMocker('keyup', CONSTANTS.LEFT);
    window.dispatchEvent(mockedEvent);
    expect(service['isMoving']).toBe(false);
  });
});
