import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementRef, NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { ColorSelectorService } from 'src/app/services/color-selector.service';
import { RectangleService } from 'src/app/services/index/drawable/rectangle/rectangle.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector.service';
import { RectangleComponent } from './rectangle.component';

describe('RectangleComponent', () => {
  let component: RectangleComponent;
  let fixture: ComponentFixture<RectangleComponent>;
  const mockedRendered = (parentElement: any, name: string, debugInfo?: any): Element => {
    const element = new Element();
    parentElement.children.push(element);
    return element;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectangleComponent ],
      providers: [
        {
          provide: RectangleService,
          useValue: {
            initializeProperties: () => { return ; },
            initialize: () => null
          }
        },
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
        ColorSelectorService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(RectangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
