import { TestBed, getTestBed } from '@angular/core/testing';

import { UndoRedoService } from './undo-redo.service';
import { Renderer2, ElementRef, Type } from '@angular/core';
import { DrawStackService } from '../draw-stack/draw-stack.service';
import { Stack } from 'src/app/classes/stack';
import { SVGElementInfos } from 'src/app/interfaces/svg-element-infos';

describe('UndoRedoService', () => {

  let service: UndoRedoService;
  let drawStack: DrawStackService;
  let manipulator: Renderer2;

  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  };

  const mockedSVGElementInfo = {
    target: null as unknown as SVGGElement,
    id: 0
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
            },
          },
        },
        DrawStackService
      ],
    });
    service = TestBed.get(UndoRedoService);
    drawStack = TestBed.get<DrawStackService>(DrawStackService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should empty stack if element is added', () => {
    service['removed'].push_back(mockedSVGElementInfo);
    expect(service.canRedo()).toBeTruthy();
    drawStack.isAdding.next(true);
    expect(service.canRedo()).not.toBeTruthy();
  });

  it('#canRedo shouldn\'t be able to redo', () => {
    expect(service.canRedo()).not.toBeTruthy();
  });

  it('#canUndo shouldn\'t be able to undo', () => {
    expect(service.canUndo()).not.toBeTruthy();
  });

  it('#undo should undo last action', () => {
    drawStack.addElementWithInfos(mockedSVGElementInfo);
    const spy = spyOn(manipulator, 'removeChild');
    service.undo();
    expect(spy).toHaveBeenCalled();
    expect(service.canRedo()).toBeTruthy();
  });

  it('#undo shouldn\'t undo because stack is empty', () => {
    const spy = spyOn(manipulator, 'removeChild');
    service.undo();
    expect(spy).not.toHaveBeenCalled();
    expect(service.canRedo()).not.toBeTruthy();
  });

  it('#redo should be able to redo last action', () => {
    service['removed'].push_back(mockedSVGElementInfo);
    const toRedrawElement = {
      target: "null" as unknown as SVGGElement,
      id: 5
    };
    let stack = new Stack<SVGElementInfos>();
    stack.push_back(toRedrawElement);
    service['toRedraw'] = stack;
    expect(service.canRedo()).toBeTruthy();
    const spy = spyOn(manipulator, 'appendChild');
    const spy2 = spyOn(service['drawStack'], 'addFromUndo');
    service.redo();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(toRedrawElement);
  });

  it('#redo should\'t redo because stack is empty', () => {
    const spy = spyOn(manipulator, 'appendChild');
    service.redo();
    expect(spy).not.toHaveBeenCalled();
    expect(service.canRedo()).not.toBeTruthy();
  });

  it('#addToRemoved should add to removed stack', () => {
    const spy = spyOn(manipulator, 'removeChild');
    service.addToRemoved(mockedSVGElementInfo);
    expect(spy).toHaveBeenCalled();
    expect(service.canRedo()).toBeTruthy();
  });

  it('#redrawStackFrom should redraw stack', () => {
    service['toRedo'] = mockedSVGElementInfo;
    const spy = spyOn(manipulator, 'removeChild');
    service['toRedraw'].push_back(mockedSVGElementInfo);
    drawStack.changeAt.next(3);
    expect(spy).toHaveBeenCalled();
  });

  it('#redrawStackFrom should redraw stack', () => {
    const spy = spyOn(manipulator, 'removeChild');
    drawStack.changeAt.next(-2);
    expect(spy).not.toHaveBeenCalled();
  });
});
