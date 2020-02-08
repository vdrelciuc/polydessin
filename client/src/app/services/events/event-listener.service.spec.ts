import { TestBed, getTestBed } from '@angular/core/testing';

import { EventListenerService } from './event-listener.service';
import { ElementRef, Renderer2 } from '@angular/core';
import { ToolSelectorService } from '../tools/tool-selector.service';
import { Tools } from 'src/app/enums/tools';
import { BehaviorSubject } from 'rxjs';
import { LineService } from '../index/drawable/line/line.service';
import { ColorSelectorService } from '../color-selector.service';

describe('EventListenerService', () => {

  let service: EventListenerService;
  let manipulator: Renderer2;
  const line: LineService = new LineService;
  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  }
  const mockedEventListener = (parentElement: any, name: string, debugInfo: (event: Event) => void): void => {
    window.addEventListener(name, debugInfo);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [  ],
      providers: [
      {
        provide: Renderer2,
        useValue: {
          createElement: () => mockedRendered,
          setAttribute: () => mockedRendered,
          appendChild: () => mockedRendered,
          listen: () => mockedEventListener,
        },
      },
      {
        provide: ToolSelectorService,
        useValue: {
          drawerService: () => null,
          $currentTool: new BehaviorSubject<Tools>(Tools.Line),
          getLine: () => line,
          getCurrentTool: () => line,
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
        {
          provide: ColorSelectorService,
          useValue: {
            },
        },
      ],
    }).compileComponents();
    const testBed = getTestBed();
    service = testBed.get(EventListenerService);
    manipulator = testBed.get(Renderer2);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#initializeEvents should initialize events', () => {
    const spyOnListen = spyOn(manipulator, 'listen');
    service.initializeEvents();
    expect(spyOnListen).toHaveBeenCalledTimes(9);
  });

  it('#initializeEvents should call window events', () => {
    service.currentTool = line;
    service.initializeEvents();
    const spy = spyOn(service['currentTool'], 'onKeyPressed');
    const spy2 = spyOn(service['currentTool'], 'onKeyReleased');
    window.dispatchEvent(new Event('keydown'));
    window.dispatchEvent(new Event('keyup'));
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
});
