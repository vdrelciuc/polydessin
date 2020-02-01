import { TestBed, getTestBed } from '@angular/core/testing';

import { EventListenerService } from './event-listener.service';
import { Renderer2, ElementRef,  } from '@angular/core';
import { ToolSelectorService } from '../tools/tool-selector.service';
import { DrawerService } from '../side-nav-drawer/drawer.service';
import { BehaviorSubject } from 'rxjs';
import { Tools } from 'src/app/enums/tools';

describe('EventListenerService', () => {

  let service: EventListenerService;
  // let manipulator: Renderer2;
  // let image: ElementRef<SVGElement>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Renderer2,
          useValue: {
              createElement: () => new SVGElement(),
              setAttribute: () => null,
              appendChild: () => null,
              removeChild: () => null,
          },
      },
      {
        provide: ToolSelectorService,
        useValue: {
          drawerService: () => new DrawerService(),
          $currentTool: () => new BehaviorSubject<Tools>(Tools.Line),
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
    });
    const testBed = getTestBed();
    service = testBed.get(EventListenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize events', () => {
    service.initializeEvents();

  })
});
