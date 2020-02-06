import { TestBed, getTestBed } from '@angular/core/testing';

import { EventListenerService } from './event-listener.service';
import { ElementRef, Renderer2 } from '@angular/core';
import { ToolSelectorService } from '../tools/tool-selector.service';
import { Tools } from 'src/app/enums/tools';
import { BehaviorSubject } from 'rxjs';
import { LineService } from '../index/drawable/line/line.service';

describe('EventListenerService', () => {

  let service: EventListenerService;
  let manipulator: Renderer2;
  const line: LineService = new LineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [  ],
      providers: [
      {
        provide: Renderer2,
        useValue: {
          createElement: () => null,
          setAttribute: () => null,
          appendChild: () => null,
          listen: () => null,
        },
      },
      {
        provide: ToolSelectorService,
        useValue: {
          drawerService: () => null,
          $currentTool: new BehaviorSubject<Tools>(Tools.Selection),
          getLine: () => new LineService(),
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
      ],
    }).compileComponents();
    const testBed = getTestBed();
    service = testBed.get(EventListenerService);
    manipulator = testBed.get(Renderer2);
    service.currentTool = line;
    service.currentTool.initialize(manipulator, testBed.get(ElementRef));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize events', () => {
    const spyOnListen = spyOn(manipulator, 'listen');
    service.initializeEvents();
    expect(spyOnListen).toHaveBeenCalledTimes(9);
  });

  it('should call keyup event', () => {
    service.currentTool = line;
    service.initializeEvents();
    const spyOnListen = spyOn(line, 'onKeyReleased');
    window.dispatchEvent(new KeyboardEvent('keyup', {key: 'backspace', bubbles: true}));
    expect(spyOnListen).toHaveBeenCalled();
  });
});
