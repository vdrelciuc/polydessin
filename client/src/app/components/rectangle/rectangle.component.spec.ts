import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RectangleComponent } from './rectangle.component';
import { NO_ERRORS_SCHEMA, Renderer2, ElementRef } from '@angular/core';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { RectangleService } from 'src/app/services/index/drawable/rectangle/rectangle.service';
import { BehaviorSubject } from 'rxjs';
import { Color } from 'src/app/classes/color';

describe('RectangleComponent', () => {
  let component: RectangleComponent;
  let fixture: ComponentFixture<RectangleComponent>;
  let service: RectangleService;
  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectangleComponent ],
      providers:[
        RectangleService,
        {
          provide: Renderer2,
          useValue: {
              createElement: () => mockedRendered,
              setAttribute: () => mockedRendered,
              appendChild: () => mockedRendered,
              removeChild: () => mockedRendered,
          },
        },
        ToolSelectorService,
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
            primaryColor: new BehaviorSubject<Color>(new Color('#FFFFFF'))
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(RectangleComponent);
    component = fixture.componentInstance;
    service = TestBed.get<RectangleService>(RectangleService);
    service.initialize(
      null as unknown as Renderer2,
      TestBed.get<ElementRef>(ElementRef),
      TestBed.get<ColorSelectorService>(ColorSelectorService)
    );
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
