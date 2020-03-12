import { TestBed, getTestBed } from '@angular/core/testing';

import { EraserService } from './eraser.service';
import { Renderer2, ElementRef, Type } from '@angular/core';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { DrawStackService } from 'src/app/services/tools/draw-stack/draw-stack.service';
import * as CONSTANTS from '../../../../classes/constants';
import { UndoRedoService } from 'src/app/services/tools/undo-redo/undo-redo.service';

describe('EraserService', () => {
  let service: EraserService;
  let manipulator: Renderer2;
  let image: ElementRef<SVGPolylineElement>;
  const mockedSVGInfo = {id: 1, target: {firstChild: null} as unknown as SVGGElement};
  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
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
                querySelectorAll: () => [],
                clientHeight: 100,
            },
          },
        },
        ColorSelectorService,
        DrawStackService
      ],
    });
    service = TestBed.get(EraserService);
    manipulator = getTestBed().get<Renderer2>(Renderer2 as Type<Renderer2>);
    image = getTestBed().get<ElementRef>(ElementRef as Type<ElementRef>)
    service.initialize(manipulator, image, 
      getTestBed().get<ColorSelectorService>(ColorSelectorService as Type<ColorSelectorService>),
      getTestBed().get<DrawStackService>(DrawStackService as Type<DrawStackService>));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#initializeProperties should set default properties', () => {
    service.initializeProperties();
    expect(service.thickness.value).toEqual(CONSTANTS.THICKNESS_MINIMUM_ERASER);
  });

  it('#onMouseMove should ', () => {
    
  });


  it('#onMouseMove should ', () => {

  });


  it('#onMouseMove should ', () => {

  });

  it('#onClick should remove top element', () => {
    service['selectedElement'] = mockedSVGInfo;
    service.assignUndoRedo(new UndoRedoService(
      service['drawStack'],
      manipulator, 
      image
    ));
    const spy1 = spyOn(service['undoRedo'], 'addToRemoved');
    const spy2 = spyOn(service['drawStack'], 'removeElement');
    service.onClick(new MouseEvent('mouseclick', {}));
    expect(spy1).toHaveBeenCalledWith(mockedSVGInfo);
    expect(spy2).toHaveBeenCalledWith(mockedSVGInfo.id);
  });

  it('#onMousePress should start removing elements', () => {
    service['leftClick'] = false;
    service.onMousePress(new MouseEvent('mousedown', {button: CONSTANTS.MOUSE_LEFT}));
    expect(service['leftClick']).toBeTruthy();
  });

  it('#onMouseRelease should stop removing elements', () => {
    service['leftClick'] = true;
    service.onMouseRelease(new MouseEvent('mouseup', {button: CONSTANTS.MOUSE_LEFT}));
    expect(service['leftClick']).not.toBeTruthy();
  });

  it('#endTool should end the tool', () => {
    service['leftClick'] = true;
    service['selectedElement'] = mockedSVGInfo;
    const spy = spyOn(manipulator, 'setAttribute');
    service.endTool();
    expect(service['leftClick']).not.toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });
});
