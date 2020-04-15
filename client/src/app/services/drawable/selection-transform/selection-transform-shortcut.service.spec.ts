// tslint:disable: no-any
import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import * as CONSTANTS from 'src/app/classes/constants';
import { Stack } from 'src/app/classes/stack';
import { Transform } from 'src/app/classes/transformations';
import { SVGProperties } from 'src/app/enums/svg-html-properties';
import { DrawStackService } from 'src/app/services/draw-stack/draw-stack.service';
import { ClipboardService } from '../../clipboard/clipboard.service';
import { SelectionTransformShortcutService } from './selection-transform-shortcut.service';

describe('SelectionTransformShortcutService', () => {
  let service: SelectionTransformShortcutService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;
  let drawStack: DrawStackService;
  let elementsToTransform: Stack<SVGGElement>;
  let selectionGroup: SVGGElement;

  let mockedEvent: KeyboardEvent;
  let mockedWheelEvent: WheelEvent;

  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  };

  const eventMocker = (event: string, keyUsed: string) => new KeyboardEvent(event, {key: keyUsed});

  const wheelEventMocker = (event: string, rollValue: number, altPressed: boolean) =>
    new WheelEvent(event, {deltaY: rollValue, altKey: altPressed});

  const mockedListener = (target: any, eventName: string, callback: (event: any) => boolean | void): () => void => {
    switch (eventName) {
      case 'keydown':
        window.addEventListener<'keydown'>(eventName, () => service['onKeyDown'](mockedEvent));
        break;
      case 'keyup':
        window.addEventListener<'keyup'>(eventName, () => service['onKeyUp'](mockedEvent.key));
        break;
      case 'wheel':
        window.addEventListener<'wheel'>(eventName, () => {
          if (mockedWheelEvent.shiftKey) {
            Transform.rotateEach(service.getRotate(mockedWheelEvent));
          } else {
            Transform.rotate(service.getRotate(mockedWheelEvent));
          }
        });
        break;
    }
    return () => undefined;
  };

  const setupElementsToTransform = (): void => {
    elementsToTransform = new Stack<SVGGElement>();

    const elementCount = 10;
    for (let i = 0; i < elementCount; i++) {
      const element: SVGGElement = document.createElementNS(SVGProperties.nameSpace, SVGProperties.g);
      elementsToTransform.pushBack(element);
    }
    Transform.setElements(elementsToTransform, manipulator);

    selectionGroup = document.createElementNS(SVGProperties.nameSpace, SVGProperties.g);
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

  it('#setupShortcuts should setup pasteShortcut listener only on first call', () => {
    const oldPasteShortcutListener = service['pasteShortcutListener'];
    service.setupShortcuts(manipulator, drawStack, image, selectionGroup);
    expect(service['pasteShortcutListener']).toEqual(oldPasteShortcutListener);
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
    expect(transformSpy).toHaveBeenCalledTimes(1);
    jasmine.clock().tick(2);
    expect(transformSpy).toHaveBeenCalledTimes(2);

    jasmine.clock().uninstall();
  });

  it('#autoMove should translate selection every 100 ms if key is held down and first delay is passed', () => {
    mockedEvent = eventMocker('keydown', CONSTANTS.LEFT);
    jasmine.clock().install();

    const transformSpy = spyOn<any>(Transform, 'translate').and.callThrough();
    window.dispatchEvent(mockedEvent);

    let callCount = 2;
    jasmine.clock().tick(CONSTANTS.FIRST_DELAY);
    expect(transformSpy).toHaveBeenCalledTimes(callCount++);
    jasmine.clock().tick(CONSTANTS.MOVE_DELAY);
    expect(transformSpy).toHaveBeenCalledTimes(callCount++);
    jasmine.clock().tick(CONSTANTS.MOVE_DELAY);
    expect(transformSpy).toHaveBeenCalledTimes(callCount++);
    jasmine.clock().tick(CONSTANTS.MOVE_DELAY);
    expect(transformSpy).toHaveBeenCalledTimes(callCount++);
    jasmine.clock().tick(CONSTANTS.MOVE_DELAY);
    expect(transformSpy).toHaveBeenCalledTimes(callCount++);

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

  it('#getRotate should return fast rotation speed when alt key is not pressed', () => {
    mockedWheelEvent = wheelEventMocker('wheel', 1, false);
    const rotationValue = service.getRotate(mockedWheelEvent);
    expect(rotationValue).toBe(service['fastRotate']);
  });

  it('#getRotate should return slow rotation speed when alt key is pressed', () => {
    mockedWheelEvent = wheelEventMocker('wheel', 1, true);
    const rotationValue = service.getRotate(mockedWheelEvent);
    expect(rotationValue).toBe(service['slowRotate']);
  });

  it('#onKeyDown should delegate to Transform class if delete key is pressed', () => {
    mockedEvent = eventMocker('keydown', 'Delete');

    const keyDownSpy = spyOn<any>(service, 'onKeyDown').and.callThrough();
    const transformSpy = spyOn<any>(Transform, 'delete').and.callThrough();
    window.dispatchEvent(mockedEvent);

    expect(keyDownSpy).toHaveBeenCalled();
    expect(transformSpy).toHaveBeenCalled();
  });

  it('#onKeyDown should delegate to Clipboard service if ctrl+x key is pressed', () => {
    mockedEvent = eventMocker('keydown', 'x');
    Object.defineProperty(mockedEvent, 'ctrlKey', { value: true });

    const keyDownSpy = spyOn<any>(service, 'onKeyDown').and.callThrough();
    const transformSpy = spyOn<any>(ClipboardService, 'cut').and.callFake(() => null);
    window.dispatchEvent(mockedEvent);

    expect(keyDownSpy).toHaveBeenCalled();
    expect(transformSpy).toHaveBeenCalled();
  });

  it('#onKeyDown should delegate to Clipboard service if ctrl+c key is pressed', () => {
    mockedEvent = eventMocker('keydown', 'c');
    Object.defineProperty(mockedEvent, 'ctrlKey', { value: true });

    const keyDownSpy = spyOn<any>(service, 'onKeyDown').and.callThrough();
    const transformSpy = spyOn<any>(ClipboardService, 'copy').and.callFake(() => null);
    window.dispatchEvent(mockedEvent);

    expect(keyDownSpy).toHaveBeenCalled();
    expect(transformSpy).toHaveBeenCalled();
  });

  it('#onKeyDown should delegate to Clipboard service if ctrl+v key is pressed', () => {
    mockedEvent = eventMocker('keydown', 'v');
    Object.defineProperty(mockedEvent, 'ctrlKey', { value: true });

    const keyDownSpy = spyOn<any>(service, 'onKeyDown').and.callThrough();
    const transformSpy = spyOn<any>(ClipboardService, 'paste').and.callFake(() => null);
    window.dispatchEvent(mockedEvent);

    expect(keyDownSpy).toHaveBeenCalled();
    expect(transformSpy).toHaveBeenCalled();
  });

  it('#onKeyDown should delegate to Clipboard service if ctrl+d key is pressed', () => {
    mockedEvent = eventMocker('keydown', 'd');
    Object.defineProperty(mockedEvent, 'ctrlKey', { value: true });

    const keyDownSpy = spyOn<any>(service, 'onKeyDown').and.callThrough();
    const transformSpy = spyOn<any>(ClipboardService, 'duplicate').and.callFake(() => null);
    window.dispatchEvent(mockedEvent);

    expect(keyDownSpy).toHaveBeenCalled();
    expect(transformSpy).toHaveBeenCalled();
  });
});
